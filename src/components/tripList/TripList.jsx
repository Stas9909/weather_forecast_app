import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './TripList.css'
import TripModal from '../portal/Portal'
import CountdownToTrip from '../countdownToTrip/CountdownToTrip'
import { icons } from '../Icons'

import KyivImage from '../../assets/Kyiv.jpg'
import AmsterdamImage from '../../assets/Amsterdam.jpg'
import CancunImage from '../../assets/Cancun.jpg'

const TripList = () => {
	const [selectedTrip, setSelectedTrip] = useState(null)
	const [weatherData, setWeatherData] = useState(null)
	const [selectedDay, setSelectedDay] = useState(0)
	const [todayWeather, setTodayWeather] = useState(null)
	const [showModal, setShowModal] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [trips, setTrips] = useState(() => {
		const getTripsToStorage = localStorage.getItem('trips')
		return getTripsToStorage
			? JSON.parse(getTripsToStorage)
			: [
					{
						id: 1,
						destination: 'Kyiv',
						startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
						endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
						image: KyivImage
					},
					{
						id: 2,
						destination: 'Amsterdam',
						startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
						endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
						image: AmsterdamImage
					},
					{
						id: 3,
						destination: 'Cancun',
						startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
						endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
						image: CancunImage
					}
			  ]
	})

	useEffect(() => {
		const sortedTrips = [...trips].sort((a, b) => {
			return new Date(a.startDate) - new Date(b.startDate)
		})
		setTrips(sortedTrips)
	}, [trips.length])

	const tripListRef = useRef(null)

	useEffect(() => {
		localStorage.setItem('trips', JSON.stringify(trips))
	}, [trips])

	const handleAddTrip = newTrip => {
		setTrips([...trips, newTrip])
	}

	const getWeatherForecast = async (city, startDate, endDate) => {
		const apiKey = 'P7NTVXVMYW6AAQJLVJ2M6M5WN'
		const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${startDate}/${endDate}?unitGroup=metric&include=current&key=${apiKey}&contentType=json`

		try {
			const response = await axios.get(apiUrl)
			return response.data
		} catch (error) {
			console.error('Error fetching weather data:', error)
			return null
		}
	}

	const getTodayWeather = async city => {
		const apiKey = 'P7NTVXVMYW6AAQJLVJ2M6M5WN'
		const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/today?unitGroup=metric&include=days&key=${apiKey}&contentType=json`

		try {
			const response = await axios.get(apiUrl)
			return response.data
		} catch (error) {
			console.error("Error fetching today's weather data:", error)
			return null
		}
	}

	const showTripDetails = async tripId => {
		const selectedTour = trips.find(trip => trip.id === tripId)
		if (selectedTour) {
			setSelectedTrip(selectedTour)
			const tripWeatherData = await getWeatherForecast(
				selectedTour.destination,
				selectedTour.startDate,
				selectedTour.endDate
			)
			setWeatherData(tripWeatherData)
		}
	}

	useEffect(() => {
		const fetchTodayWeather = async () => {
			if (selectedTrip) {
				const weatherData = await getTodayWeather(selectedTrip.destination)
				if (weatherData && weatherData.days.length > 0) {
					setTodayWeather(weatherData.days[0])
				}
			}
		}
		fetchTodayWeather()
	}, [selectedTrip])

	// useEffect(() => {
	// 	if (selectedTrip) {
	// 		getTodayWeather(selectedTrip.destination).then(weatherData => {
	// 			if (weatherData && weatherData?.days.length > 0) {
	// 				setTodayWeather(weatherData.days[0])
	// 			}
	// 		})
	// 	}
	// }, [selectedTrip])

	const scrollRight = () => {
		tripListRef.current && tripListRef.current.parentElement.scrollBy({ left: 100, behavior: 'smooth' })
	}

	const scrollLeft = () => {
		tripListRef.current && tripListRef.current.parentElement.scrollBy({ left: -100, behavior: 'smooth' })
	}

	const filteredTrips = trips.filter(trip => trip.destination.toLowerCase().includes(searchQuery.toLowerCase().trim()))

	return (
		<div className="container">
			<div className='disposition'>
				<div className="upperWrapper">
					<p className="mainHeader">
						Weather <span className="inBold">Forecast</span>
					</p>
					<input
						className="searchInput"
						type="text"
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						placeholder="Search for a trip..."
					/>
					<div className="generalDataWrapper">
						<div className="tripListWrapper">
							<div className="scrollButtonsContainer">
								<button className="scrollButton" onClick={scrollLeft}>
									Previous
								</button>
								<button className="scrollButton" onClick={scrollRight}>
									Next
								</button>
							</div>
							<div ref={tripListRef}>
								<ul className="tripList">
									{filteredTrips.map(trip => (
										<li className="tripItem" key={trip.id} onClick={() => showTripDetails(trip.id)}>
											<div className="divForImg">
												<img className="cityImg" src={trip.image} alt={trip.destination} />
											</div>
											<div>
												<h3 className="tripDestination">{trip.destination}</h3>
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>
						<button className="addTripBtn" onClick={() => setShowModal(true)}>
							+ <br /> Add Trip
						</button>
						<TripModal
							isOpen={showModal}
							onClose={() => setShowModal(false)}
							onAddTrip={handleAddTrip}
							arrLength={trips.length}
						/>
					</div>
				</div>

				{selectedTrip && todayWeather && (
					<div className="CurrentTripDetails">
						<div className="modalWrapper">
							<div className="modalData">
								<p className="curentDay">
									{new Date(todayWeather.datetime).toLocaleDateString('en-US', { weekday: 'long' })}
								</p>
								<div className="forecastInModal">
									<div className="iconInModal">
										<img className="iconImg" src={icons[todayWeather.icon]} alt={todayWeather.icon} />
									</div>
									<p className="tempInModal">{todayWeather.temp}</p>
								</div>
								<p className="destinationInModal">{selectedTrip.destination}</p>
							</div>
							<div className="countDown">
								<CountdownToTrip startDate={selectedTrip.startDate} />
							</div>
						</div>
					</div>
				)}

			</div>

			{selectedTrip && (
				<div className="tripDetailsWrapper">
					{weatherData && (
						<div className="daysList">
							<p className="forecastWeekHeader">Week</p>
							<ul className="forecastWeekWrapper">
								{weatherData?.days.map((day, index) => {
									return (
										<li key={index} className="forecastDay">
											<p className="weekDay">
												{new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'long' })}
											</p>
											<div className="icon">
												<img className="iconImg" src={icons[day.icon]} alt={day.icon} />
											</div>
											<p className="temp">
												{day.tempmax}°/{day.tempmin}°
											</p>
										</li>
									)
								})}
								{/* {weatherData?.days.map((day, index) => (
									<li key={index} className="forecastDay">
										<p>
											{new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'long' })}
										</p>
									</li>
								))} */}
							</ul>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default TripList
