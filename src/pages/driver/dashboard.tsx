/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import GoogleMapReact from 'google-map-react'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client'
import { FULL_ORDER_FRAGMENT } from '../../fragments'
import { useNavigate } from 'react-router-dom'
import { takeOrder, takeOrderVariables } from '../../__generated__/takeOrder'

import axios from 'axios'
import {
  cookedOrders,
  cookedOrders_cookedOrders,
} from '../../__generated__/cookedOrders'

const COOKED_ORDER = gql`
  query cookedOrders {
    cookedOrders {
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

const Driver: React.FC<IDriver> = ({ position }) => (
  <div
    className="text-lg"
    style={{ position: 'absolute', top: position.lat, left: position.lng }}>
    🚗
  </div>
)

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
      // const goecoder = new google.maps.Geocoder()
      /*  goecoder.geocode(
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

  const { data: cookedOrderData } = useQuery<cookedOrders>(COOKED_ORDER)

  useEffect(() => {
    if (cookedOrderData?.cookedOrders.length) {
      makeRoute()
    }
  }, [cookedOrderData])

  const navigate = useNavigate()

  const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
    TAKE_ORDER
  )

  const triggerMutation = (orderId: number) => {
    takeOrderMutation({
      variables: {
        input: {
          id: orderId,
        },
      },
      onCompleted: (data: takeOrder) => {
        if (data.takeOrder.ok) {
          navigate(`/order/${orderId}`)
        }
      },
    })
  }

  const [apiKey, setApiKey] = useState<string>('')
  useEffect(() => {
    const fetchGoogleMapsApiKey = async () => {
      try {
        const response = await axios.get('/api/google-maps/api-key')
        const apiKey = response.data
        setApiKey(apiKey)
      } catch (error) {
        console.error('Error fetching Google Maps API key:', error)
      }
    }

    fetchGoogleMapsApiKey()
  }, [])

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
            lat: driverCoords.lat,
            lng: driverCoords.lng,
          }}
          bootstrapURLKeys={{
            key: apiKey,
          }}>
          <Driver position={driverCoords} />
        </GoogleMapReact>
      </div>
      <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrderData?.cookedOrders.map(
          (order: cookedOrders_cookedOrders) => (
            <React.Fragment key={order.id}>
              <h1 className="text-center text-3xl font-medium">
                New Cooked Order
              </h1>
              <h4 className="text-center text-2xl my-3 font-medium">
                Pick it up Soon! @ {order.restaurant?.name}
              </h4>
              <button
                onClick={() => triggerMutation(order.id)}
                className="btn w-full block text-center mt-5">
                Accept Order &rarr;
              </button>
            </React.Fragment>
          )
        )}
        {cookedOrderData?.cookedOrders.length === 0 && (
          <h1 className="text-center text-3xl font-medium">No orders yet...</h1>
        )}
      </div>
    </div>
  )
}
