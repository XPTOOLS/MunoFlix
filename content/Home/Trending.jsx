import TrendingCard from "@/components/Cards/TrendingCard/TrendingCard"
import { Fragment } from "react"

const Trending = ({ data }) => {
  const { results = [] } = data || {};

  return (
    <div className="w-full max-w-[96rem] mx-auto px-4 lg:px-6">
      {/* Gradient line matching your theme */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#6c5dd3] to-transparent my-8 opacity-50"></div>

      {/* Trending Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {results
          .slice(0, 18)
          .map((item, index) =>
            <Fragment key={`${item.id}-${index}`}>
              <TrendingCard info={item} />
            </Fragment>
          )
        }
      </div>
    </div>
  )
}

export default Trending