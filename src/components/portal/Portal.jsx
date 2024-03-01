import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './Portal.css'

import ParisImage from '../../assets/Paris.jpg'
import BerlinImage from '../../assets/Berlin.jpg'
import LondonImage from '../../assets/London.jpg'
import TokyoImage from '../../assets/Tokyo.jpg'
import SydneyImage from '../../assets/Sydney.jpg'
import CapeTownImage from '../../assets/CapeTown.jpg'
import RioDeJaneiroImage from '../../assets/Rio_de_Janeiro.jpg'
import SingaporeImage from '../../assets/Singapore.jpg'
import MumbaiImage from '../../assets/Mumbai.jpg'
import HawaiiImage from '../../assets/Hawaii.jpg'
import SantoriniImage from '../../assets/Santorini.jpg'
import BarcelonaImage from '../../assets/Barcelona.jpg'

const cities = [
	{ id: 3, name: 'Paris', image: ParisImage },
	{ id: 4, name: 'Berlin', image: BerlinImage },
	{ id: 5, name: 'London', image: LondonImage },
	{ id: 6, name: 'Tokyo', image: TokyoImage },
	{ id: 7, name: 'Sydney', image: SydneyImage },
	{ id: 8, name: 'Cape Town', image: CapeTownImage },
	{ id: 9, name: 'Rio de Janeiro', image: RioDeJaneiroImage },
	{ id: 10, name: 'Singapore', image: SingaporeImage },
	{ id: 11, name: 'Mumbai', image: MumbaiImage },
	{ id: 12, name: 'Hawaii', image: HawaiiImage },
	{ id: 13, name: 'Santorini', image: SantoriniImage },
	{ id: 14, name: 'Barcelona', image: BarcelonaImage }
]

const TripModal = ({ isOpen, onClose, onAddTrip, arrLength }) => {
	const [selectedCity, setSelectedCity] = useState('')
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [isStartDateActive, setIsStartDateActive] = useState(false)
	const [isEndDateActive, setIsEndDateActive] = useState(false)

	const handleStartDateChange = value => {
		setStartDate(value)
		setIsStartDateActive(true)
		setEndDate('')
	}

	const handleEndDateChange = value => {
		setEndDate(value)
		setIsEndDateActive(true)
	}

	const handleAddTrip = () => {
		if (!selectedCity || !startDate || !endDate) {
			return
		}

		const selectedImage = cities.find(city => city.name === selectedCity).image

		if (selectedCity && startDate && endDate) {
			onAddTrip({
				id: arrLength + 1,
				destination: selectedCity,
				startDate,
				endDate,
				image: selectedImage
			})
			onClose()
		}
	}

	const maxEndDateTimestamp = startDate ? new Date(Date.parse(startDate) + 15 * 24 * 60 * 60 * 1000) : new Date()
	const maxEndDate = maxEndDateTimestamp.toISOString().split('T')[0]

	return isOpen
		? ReactDOM.createPortal(
				<div className="modal">
					<div className="modal-content">
						<div className="upperBlock">
							<h2 className="modalHeader">Create Trip</h2>
							<span className="close" onClick={onClose}>
								&times;
							</span>
						</div>
						<div className="middleBlock ">
							<div className="cityBlock inputBlock">
								<label className="label">
									<span className="star">*</span> City:
								</label>
								<select
									className="citySelect inputOpiotns"
									value={selectedCity}
									onChange={e => setSelectedCity(e.target.value)}
								>
									<option value="">Please select a city</option>
									{cities.map(city => (
										<option key={city.id} value={city.name}>
											{city.name}
										</option>
									))}
								</select>
							</div>
							<div className="startDateBlock inputBlock">
								<label className="label">
									<span className="star">*</span> Start date:
								</label>
								<input
									className="startDateInput inputOpiotns"
									type={isStartDateActive ? 'date' : 'text'}
									value={startDate}
									placeholder="Select date"
									onFocus={() => setIsStartDateActive(true)}
									onBlur={() => setIsStartDateActive(false)}
									min={new Date().toISOString().split('T')[0]}
									max={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
									onChange={e => handleStartDateChange(e.target.value)}
								/>
							</div>
							<div className="endDateBlock inputBlock">
								<label className="label">
									<span className="star">*</span> End date:
								</label>
								<input
									className="endDateInput inputOpiotns"
									type={isEndDateActive ? 'date' : 'text'}
									value={endDate}
									placeholder="Select date"
									onFocus={() => setIsEndDateActive(true)}
									onBlur={() => setIsEndDateActive(false)}
									min={startDate}
									max={maxEndDate}
									onChange={e => handleEndDateChange(e.target.value)}
									disabled={!startDate}
								/>
							</div>
						</div>
						<div className="loweBlock">
							<button className="cancelBtn modalBtn" onClick={onClose}>
								Cancel
							</button>
							<button className="doneBtn modalBtn" onClick={handleAddTrip}>
								Done
							</button>
						</div>
					</div>
				</div>,
				document.getElementById('portal-root')
		  )
		: null
}

export default TripModal
