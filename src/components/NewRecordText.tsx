import React, { useEffect, useState } from 'react'

interface Props {
	text?: string;
}

export default function NewRecordText({text = "New record!"}: Props) {
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
		<h4 style={{ color: `hsl(${hue}, 100%, 50%)` }} className='text-center'>{text}</h4>
	)
}
