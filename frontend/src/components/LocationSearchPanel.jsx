import React from "react";

const LocationSearchPanel = ({ suggestions,setPickup,setDestination,activeField,setVehiclePanel,setPanelOpen}) => {

    const handleSuggestionClick = (suggestion) => {

        if(activeField == 'pickup'){
            setPickup(suggestion)
        }else if(activeField == 'destination'){
            setDestination(suggestion)
        }
        // setVehiclePanel(true)
        // setPanelOpen(false)
    }
    return (
        <div>
            {/* Conditional check: Render the map only if suggestions is a truthy value */}
            {
                suggestions && suggestions.map((data,idx) => {
                    return(
                    <div key={idx} onClick={() => handleSuggestionClick(data)} className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start'>
                        <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'><i className="ri-map-pin-fill"></i></h2>
                        <h4 className='font-medium'>{data}</h4>
                    </div>)
                })
            }
        </div>
        
    );
}

export default LocationSearchPanel;