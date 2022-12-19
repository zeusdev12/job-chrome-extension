import React from 'react'
import './style.css'
import JobCard from './JobCard'
import JToggle from './jobToggle'
import Loader from '../../components/Loader'
import Search from './Search'
import BlankSlate from './BlankSlate'
const List = ({
    data,
    isLoading,
    jobToggle,
    setJobToggle,
    searchTextBox,
    handleViewJobCriteria,
    getJob,
    handleRemoveJob,
    handleViewJobProspects,
    handleAddProspects,
    searchTextBoxChange
}) => {

    return (
        <div className="jobs-list-container">

            <div className="jobs-list-top-container">
                <Search
                    jobs={data}
                    searchTextBox={searchTextBox}
                    getJob={getJob}
                    searchTextBoxChange={searchTextBoxChange}
                />
                <JToggle jobToggle={jobToggle} setJobToggle={setJobToggle} />
            </div>

            { isLoading ?
                <div style={{marginTop:'20%'}}>
                <span className="loader-wrapper"><Loader color='#297AF7' height='50px' width='50px' /></span>
                </div>
                :
                <>
                    <div className="jobs-list-content">
                        {data.length > 0 ?
                            data.map((job, i) =>
                                <JobCard
                                    key={i}
                                    job={job}
                                    handleViewJobCriteria={handleViewJobCriteria}
                                    handleRemoveJob={handleRemoveJob}
                                    handleViewJobProspects={handleViewJobProspects}
                                    handleAddProspects={handleAddProspects}
                                    jobToggle={jobToggle}
                                />
                            )
                            :
                            <BlankSlate />
                        }
                    </div>
                </>
            }
        </div>
    )
}

export default List;