import React from 'react'
import { Modifiers } from '../server/beatsaber/data/LevelData'
import { Badge } from 'react-bootstrap';

interface Props {
	modifiers: Modifiers;
}

export default function ModifierBadges({ modifiers }: Props) {
	return (
		<span>
			{Object.keys(modifiers).map(key => <Badge className='me-1 mt-1' key={key} bg={((modifiers as any)[key] as boolean) ? "success" : "danger"}>{key}</Badge>)}
		</span>
	)
}