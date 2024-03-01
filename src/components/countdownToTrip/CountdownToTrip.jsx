import React, { useState, useEffect } from 'react'
import './CountdownToTrip.css'

const CountdownToTrip = ({ startDate }) => {
	const calculateTimeLeft = () => {
		const difference = new Date(startDate) - new Date()
		let countdownTime = {}

		if (difference <= 0) {
			countdownTime.days = 0
			countdownTime.hours = 0
			countdownTime.minutes = 0
			countdownTime.seconds = 0
		} else {
			countdownTime = {
				days: Math.floor(difference / (1000 * 60 * 60 * 24)),
				hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
				minutes: Math.floor((difference / 1000 / 60) % 60),
				seconds: Math.floor((difference / 1000) % 60)
			}
		}

		return countdownTime
	}

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

	// useEffect(() => {
	//   const timer = setTimeout(() => {
	//     setTimeLeft(calculateTimeLeft());
	//   }, 1000);
	//   return () => clearTimeout(timer);
	// });

	useEffect(() => {
		const updateTimer = () => {
			const newTimeLeft = calculateTimeLeft()
			setTimeLeft(newTimeLeft)

			if (newTimeLeft.seconds > 0) {
				requestAnimationFrame(updateTimer)
			}
		}
		requestAnimationFrame(updateTimer)

		return () => {
			cancelAnimationFrame(updateTimer)
		}
	}, [startDate])

	return (
		<div className="countdownTimer">
			<div className="timeLeftWrapper">
				<span className="timeLeft">{timeLeft.days} </span> <br /> DAYS
			</div>
			<div className="timeLeftWrapper">
				<span className="timeLeft">{timeLeft.hours}</span> <br /> HOURS
			</div>
			<div className="timeLeftWrapper">
				<span className="timeLeft">{timeLeft.minutes}</span> <br /> MINUTES
			</div>
			<div className="timeLeftWrapper">
				<span className="timeLeft">{timeLeft.seconds}</span> <br /> SECONDS
			</div>
		</div>
	)
}

export default CountdownToTrip
