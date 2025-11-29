import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    
    // Get daily visits
    const dailyVisits = await db.collection('visits').aggregate([
      {
        $group: {
          _id: '$date',
          visits: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$sessionId' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]).toArray();

    // Get ALL pages to see what we actually have
    const allPages = await db.collection('visits').aggregate([
      {
        $group: {
          _id: '$page',
          visits: { $sum: 1 }
        }
      },
      { $sort: { visits: -1 } }
    ]).toArray();

    console.log('=== ANALYTICS DEBUG ===');
    console.log('Total pages in database:', allPages.length);
    console.log('Top 20 pages:');
    allPages.slice(0, 20).forEach((page, index) => {
      console.log(`${index + 1}. ${page._id}: ${page.visits} visits`);
    });
    
    // Check if /watch exists
    const watchPage = allPages.find(p => p._id === '/watch');
    console.log('/watch page exists:', !!watchPage);
    if (watchPage) {
      console.log('/watch visits:', watchPage.visits);
    }

    // Group pages for better analytics
    const groupedPages = allPages.map(page => {
      const pagePath = page._id;
      
      // Group individual movie pages
      if (pagePath.startsWith('/watch/')) {
        return {
          _id: 'Watch Movies',
          visits: page.visits,
          isGrouped: true,
          originalPath: pagePath
        };
      }
      if (pagePath.startsWith('/translated/')) {
        return {
          _id: 'Translated Movies', 
          visits: page.visits,
          isGrouped: true,
          originalPath: pagePath
        };
      }
      
      // Keep main pages as is
      return {
        _id: pagePath === '/' ? 'Home' : pagePath,
        visits: page.visits,
        isGrouped: false,
        originalPath: pagePath
      };
    });

    // Aggregate grouped pages
    const finalPages = [];
    const groupedMap = new Map();
    
    groupedPages.forEach(page => {
      if (page.isGrouped) {
        const existing = groupedMap.get(page._id);
        if (existing) {
          existing.visits += page.visits;
          existing.originalPaths.push(page.originalPath);
        } else {
          groupedMap.set(page._id, {
            _id: page._id,
            visits: page.visits,
            originalPaths: [page.originalPath]
          });
        }
      } else {
        finalPages.push({
          _id: page._id,
          visits: page.visits
        });
      }
    });

    // Add grouped pages to final result
    groupedMap.forEach(value => {
      finalPages.push({
        _id: value._id,
        visits: value.visits,
        _debug: { samplePaths: value.originalPaths.slice(0, 3) } // Show sample paths for debugging
      });
    });

    // Sort by visits and take top 10
    const popularPages = finalPages
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);

    console.log('Final popular pages:', popularPages);

    return NextResponse.json({
      daily: dailyVisits.map(day => ({
        date: day._id,
        visits: day.visits,
        uniqueVisitors: day.uniqueVisitors.length
      })),
      weekly: [], // You can add these back if needed
      monthly: [], // You can add these back if needed
      popularPages: popularPages,
      _debug: {
        totalPages: allPages.length,
        samplePages: allPages.slice(0, 10),
        hasWatchPage: !!watchPage
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}