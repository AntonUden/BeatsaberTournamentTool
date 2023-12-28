import React from 'react'
import { Col, Container, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Start() {
	return (
		<Container>
			<Row>
				<Col>
					<ListGroup>
						<ListGroupItem>
							<Link to="/live">Live stats</Link>
						</ListGroupItem>

						<ListGroupItem>
							<Link to="/admin">Admin page</Link>
						</ListGroupItem>

						<ListGroupItem>
							<Link to="/unattended_se">Unattended (Swedish)</Link>
						</ListGroupItem>
					</ListGroup>
				</Col>
			</Row>
		</Container>
	)
}
