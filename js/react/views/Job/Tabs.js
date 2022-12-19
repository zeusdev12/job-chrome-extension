import React from 'react'
import './style.css'

const Tabs = ({
    tabNumber,
    setTab,
    permissions
}) => {

    return (
        < div className="job-view-tabs-container" style={{ height: '30%' }}>
            <div>
                <span
                    className={`${tabNumber === '1' ? "tab-default-active" : "tab-default-inactive"} tab-default`}
                    onClick={() => { setTab('1') }}>
                    Job Criteria
                </span>
                <span
                    className={`${tabNumber === '2' ? "tab-default-active" : "tab-default-inactive"} tab-default`}
                    onClick={() => { setTab('2') }}>Prospects
                </span>
                <span className={`${tabNumber === '3' ? "tab-default-active" : "tab-default-inactive"} tab-default`}
                    onClick={() => { setTab('3') }}>Pre Eval Form
                </span>
                {
                    (permissions === '*' || permissions?.includes('VIEW_TRIBE_ACTIVITY'))
                    &&
                    <span
                        className={`${tabNumber === '4' ? "tab-default-active" : "tab-default-inactive"} tab-default`}
                        onClick={() => { setTab('4') }}>Tribe
            </span>
                }
            </div>
        </div>
    )
}

export default Tabs;