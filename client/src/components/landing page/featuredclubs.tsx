import ClubPreviewCard from "@/components/cards/ClubPreviewCard";
import {useQuery} from "@tanstack/react-query";
import ClubLoadingPlaceholder from "@/components/cards/ClubLoadingPlaceholder.tsx";

import {IClub} from "@/lib/types.ts";
import {axiosInstance} from "@/lib/utils.ts";
import ClubFetchingErrorMessage from "@/components/error/ClubFetchingErrorMessage.tsx";


const fetchFeaturedClubs = async () => {
  return axiosInstance.get('/api/clubs/?featured=true')
}

const FeaturedClubs = () => {

  const {isFetching, isError, isSuccess, data } = useQuery({
    queryKey: ["Clubs"], // query refreshes when this value changes
    queryFn: fetchFeaturedClubs,
  });

  return (
    <section className="container pt-16 gap-y-10" id="featured-clubs-section">
      <h1 className="w-full text-2xl font-bold text-center lg:text-3xl">Featured Clubs</h1>
      <p className="mt-2 text-center text-muted-foreground">These are our top clubs for this week. Club of the week is the top established club, Upcoming club a new club starting out</p>
      {/* <div className={`grid grid-cols-1 ${(!isError && data?.data.length > 0) ? 'md:grid-cols-2' : ''} min-h-[25rem] mt-4`}> */}
      <div className={`flex gap-8 justify-center min-h-[25rem] mt-4`}>
          {isFetching ?
            <>
              <ClubLoadingPlaceholder />
              <ClubLoadingPlaceholder />
            </>
          : (isError || data?.data.length === 0) ?
            <div className='h-full mt-24'>
              <ClubFetchingErrorMessage />
            </div>
          : 
              isSuccess && data ? data.data.map((club: IClub) => (
                <ClubPreviewCard club={club} key={club._id}/>
              )) : (
                <div className='h-full mt-24'>
                  <ClubFetchingErrorMessage />
                </div>
              )
          }
      </div>

    </section>
  )
}

export default FeaturedClubs;
