/* import React, { useEffect, useState } from 'react'
import GoogleMapReact from 'google-map-react'

interface ICords {
  lat: number
  lng: number
}

export const Dashboard = () => {
  const [driverCords, setDriverCords] = useState<ICords>({ lat: 0, lng: 0 })
  //@ts-ignore
  const onSucces = ({ coords: { latitude, longitude } }: Position) => {
    setDriverCords({ lat: latitude, lng: longitude })
  }
  const onError = (error: PositionErrorCallback) => {
    console.log(error)
  }
  useEffect(() => {
    //@ts-ignore
    navigator.geolocation.watchPosition(onSucces, onError, {
      enableHighAccuracy: true,
    })
  }, [])

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    console.log(map.getZoom())
    setTimeout(() => {
      map.panTo(new maps.LatLng(driverCords.lat, driverCords.lng))
    }, 1000)
  }
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: '95vh' }}>
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={15}
          defaultCenter={{ lat: -3.37, lng: 36.6 }}
          bootstrapURLKeys={{
            key: 'AIzaSyDCE_lrgv5W3SWyk8Sl9F3w3guqCTqpZJk',
          }}>
          <div
            //@ts-ignore
            lat={driverCords.lat}
            lng={driverCords.lng}>
            🚗
          </div>
        </GoogleMapReact>
      </div>
    </div>
  )
}
 */

import React, { useEffect, useState } from 'react'
import GoogleMapReact from 'google-map-react'

interface ICords {
  lat: number
  lng: number
}

const CarIcon = () => (
  <div className="text-lg bg-red-400 h-44 w-44" style={{ fontSize: '24px' }}>
    🚗
  </div>
)

export const Dashboard = () => {
  const [driverCords, setDriverCords] = useState<ICords>({ lat: 0, lng: 0 })
  const [map, setMap] = useState<any>()
  const [maps, setMaps] = useState<any>()
  //@ts-ignore
  const onSucces = ({ coords: { latitude, longitude } }: Position) => {
    setDriverCords({ lat: latitude, lng: longitude })
  }
  //@ts-ignore
  const onError = (error: PositionError) => {
    console.log(error)
  }

  useEffect(() => {
    navigator.geolocation.watchPosition(onSucces, onError, {
      enableHighAccuracy: true,
    })
  }, [])
  useEffect(() => {
    if (map && maps) {
      map.panTo(new maps.LatLng(driverCords.lat, driverCords.lng))
    }
  }, [driverCords.lat, driverCords.lng])

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new maps.LatLng(driverCords.lat, driverCords.lng))
    setMap(map)
    setMaps(maps)
  }

  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: '100%', height: '95vh' }}>
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={15}
          defaultCenter={{ lat: -3.37, lng: 36.6 }}
          bootstrapURLKeys={{
            key: 'AIzaSyDCE_lrgv5W3SWyk8Sl9F3w3guqCTqpZJk',
          }}>
          <CarIcon
            //@ts-ignore
            lat={driverCords.lat}
            lng={driverCords.lng}
          />
        </GoogleMapReact>
      </div>
    </div>
  )
}
