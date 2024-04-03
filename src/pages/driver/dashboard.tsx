/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import GoogleMapReact from 'google-map-react'
import { gql, useMutation, useSubscription } from '@apollo/client'
import { FULL_ORDER_FRAGMENT } from '../../fragments'
import {  useNavigate } from 'react-router-dom'
import { coockedOrder } from '../../__generated__/coockedOrder'
import { takeOrder, takeOrderVariables } from '../../__generated__/takeOrder'

const COOKED_ORDER = gql`
  subscription coockedOrder {
    coockedOrder {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`

const TAKE_ORDER = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`

interface ICoords {
  lat: number
  lng: number
}

interface IDriver {
  position: {
    lat?: number
    lng?: number
  }
  $hover?: any
}

/* const Driver: React.FC<IDriver> = ({ position }) => (
  <div
    className="text-lg"
    style={{ position: 'absolute', top: position.lat, left: position.lng }}>
    🚗
  </div>
) */

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 })
  const [map, setMap] = useState<google.maps.Map>()
  const [maps, setMaps] = useState<any>()
  // @ts-ignore
  const onSucces = ({ coords: { latitude, longitude } }: Position) => {
    setDriverCoords({ lat: latitude, lng: longitude })
  }
  // @ts-ignore
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
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng))
      /*   const goecoder = new google.maps.Geocoder()
      goecoder.geocode(
        {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        (results, status) => {
          console.log(status, results)
        }
      ) */
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverCoords.lat, driverCoords.lng])
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng))
    setMap(map)
    setMaps(maps)
  }

  const makeRoute = () => {
    if (map) {
      const directionService = new google.maps.DirectionsService()
      const directionRenderer = new google.maps.DirectionsRenderer()
      directionRenderer.setMap(map)
      directionService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.5,
              driverCoords.lng + 0.5
            ),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result) => {
          directionRenderer.setDirections(result)
        }
      )
    }
  }

  const { data: cookedOrderData } = useSubscription<coockedOrder>(COOKED_ORDER)

  useEffect(() => {
    if (cookedOrderData?.coockedOrder.id) {
      makeRoute()
    }
  }, [cookedOrderData])

  const naviagate = useNavigate()
  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok) {
      naviagate(`/orders/${cookedOrderData?.coockedOrder.id}`)
    }
  }

  const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
    TAKE_ORDER,
    { onCompleted }
  )
  const triggerMutation = (orderId: number) => {
    takeOrderMutation({
      variables: {
        input: {
          id: orderId,
        },
      },
    })
  }

  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: '50vh' }}>
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={15}
          draggable={true}
          defaultCenter={{
            lat: -3.37,
            lng: 36.6,
          }}
          bootstrapURLKeys={{
            key: 'key',
          }}></GoogleMapReact>
      </div>
      <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrderData ? (
          <>
            <h1 className="text-center text-3xl font-medium">
              New Cooked Order
            </h1>
            <h4 className="text-center text-2xl my-3 font-medium">
              Pick it up Soon! @{' '}
              {cookedOrderData?.coockedOrder.restaurant?.name}
            </h4>
            <button
              onClick={() => triggerMutation(cookedOrderData.coockedOrder.id)}
              className="btn w-full block text-center mt-5">
              Accept Order &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center text-3xl font-medium">No orders yet...</h1>
        )}
      </div>
    </div>
  )
}
