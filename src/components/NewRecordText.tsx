import React, { useEffect, useState } from 'react'

export default function NewRecordText() {
	const [hue, setHue] = useState<number>(0)

	useEffect(() => {
		const intervalId = setInterval(() => { randomColor(); }, 250);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	function randomColor() {
		setHue(Math.round(Math.random() * 360));
	}

	return (
		<h4 style={{ color: `hsl(${hue}, 100%, 50%)` }} className='text-center'>New record!</h4>
	)
}
