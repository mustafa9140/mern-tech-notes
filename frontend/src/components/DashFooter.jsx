import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'
import React from 'react'

const DashFooter = () => {

    const navigate = useNavigate()
    const { pathName } = useLocation()

    const onGoHomeClicked = () => navigate('/')

    let goHomeButton = null
    if (pathName !== '/dash') {
        goHomeButton = (
            <button className='dash-footer__button icon-button' title="Home" onClick={onGoHomeClicked}>
                <FontAwesomeIcon icon={faHouse}></FontAwesomeIcon>
            </button>
        )
    }

    const content = (
        <footer className='dash-footer'>
            {goHomeButton}
            <p>Current User:</p>
            <p>Status: </p>
        </footer>
    )
    return content
}

export default DashFooter
