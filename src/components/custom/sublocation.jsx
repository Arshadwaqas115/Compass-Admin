"use client"

export const Sublocation = ({item,deleteSubLocation}) => {
  return (
   
        <div className=" relative flex flex-col gap-4 border w-[220px] rounded-xl  border-gray-400 p-4 cursor-pointer hover:scale-105       ease-out">
                    <div className="flex flex-col gap-2">
                         <h1>Location name:</h1>
                         <h1>{item.name}</h1>
                    </div>
                    <div className="flex flex-col gap-2">
                         <h1>Stay From:</h1>
                         <h1>{item.start}</h1>
                    </div>
                    <div className="flex flex-col gap-2">
                         <h1>Stay To:</h1>
                         <h1>{item.end}</h1>
                    </div>
                    <div onClick={()=>{deleteSubLocation(item)}}>
                    <span  class="bg-red-100 absolute top-0 right-[-14px] text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300 hover:text-white hover:bg-black">Delete</span>

                    </div>
        </div>

  )
}

