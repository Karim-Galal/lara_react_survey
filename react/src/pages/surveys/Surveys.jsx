import React from 'react'
import PageTitle from '../../components/PageTitle'
import SurveysList from '../../components/SurveysList'
import { Outlet } from 'react-router-dom'


const Surveys = () => {
  return (
    <div>
      <PageTitle title="Surveys" />

      <div>
        <SurveysList />
      </div>


      <Outlet />
    </div>
  )
}

export default Surveys
