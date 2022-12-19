import React, {useState, useRef} from 'react'
import { Button } from 'reactstrap'
import qs from 'query-string'

const AdvanceFilterTags = ({
    Visa,
    setVisa,
    setVisaStatus,
    setFilterCount,
    setSkillsFilterList,
    setTitleFilterList,
    setCompanyFilterList,
    setSchoolsFilterList,
    setIndustryFilterList,
    skillsFilterList,
    titleFilterList,
    schoolsFilterList,
    companyFilterList,
    industryFilterList,
    
    qsParams,
    push,
    skillFilterCount, 
    titleFilterCount,
    companyFilterCount,
    schoolFilterCount,
    industryFilterCount,
    visaFilterCount,
    advanceFilterCount,
  }) => {

    const tagArr = [{name: 'Skills', value: skillFilterCount ? advanceFilterCount ? 2 : 1 : 0},
                    {name: 'Title', value: titleFilterCount ? advanceFilterCount ? 2 : 1 : 0},  
                    {name: 'Industry', value: industryFilterCount ? advanceFilterCount ? 2 : 1 : 0} , 
                    {name: 'Company', value: companyFilterCount ? advanceFilterCount ? 2 : 1 : 0} , 
                    {name: 'Schools', value: schoolFilterCount ? advanceFilterCount ? 2 : 1 : 0} , 
                    {name: 'Visa', value: visaFilterCount ? advanceFilterCount ? 2 : 1 : 0}] 

    const tagContainerRef = useRef(null)

    const handleClick = (e) => {
      switch(e.target.name){
        case 'Skills':{
          delete qsParams.skillFilter
          setSkillsFilterList(skillsFilterList.map(itm => { return { name: itm.name, value: false } }))
          break
        }
        case 'Title':{
          delete qsParams.titleFilter
          setTitleFilterList(titleFilterList.map(itm => { return { name: itm.name, value: false } }))
          break
        }
        case 'Industry':{
          delete qsParams. industryFilter
          setCompanyFilterList(companyFilterList.map(itm => { return { name: itm.name, value: false } }))
          break
        }
        case 'Company':{
          delete qsParams.companyFilter
          setSchoolsFilterList(schoolsFilterList.map(itm => { return { name: itm.name, value: false } }))
          break
        }
        case 'Schools':{
          delete qsParams.schoolFilter
          setIndustryFilterList(industryFilterList.map(itm => { return { name: itm.name, value: false } }))
          break
        }
        case 'Visa':{
          delete qsParams.visa
          setVisa(Visa.map(v => {
            return {
              id: v.id,
              value: false
            }
          }))
          break
        }
      }

      if(tagArr.every(itm => !itm.value)){
        setVisaStatus(0)
        setFilterCount(0)
        if(qsParams.advanceFilterElemenate)
          delete qsParams.advanceFilterElemenate
      }

      push(`/html/job.html?${qs.stringify(qsParams)}`)
    }

    const handleMouseOver = (e) => {
      e.target.innerHTML= `X ${e.target.name}`
    }
    const handleMouseOut = (e) => {
      e.target.innerHTML= `✓ ${e.target.name}`
    }
    const handleLeftScroll = () => {
      tagContainerRef.current.scrollLeft -= 100
    }
    const handleRightScroll =() => {
      tagContainerRef.current.scrollLeft += 100
    }

  return (
    <React.Fragment>
      {tagArr.filter(itm=>itm.value).length > 3 && 
        <Button
          color='secondary'
          outline
          onClick={handleLeftScroll} 
          className='filterTagScrollButton'
        >{'<'}</ Button>}
      <div
        ref={tagContainerRef}
        style={{margin: tagArr.every(itm => !itm.value) && '0'}} 
        className='advanceFilterTagsContainer'>
        {
          tagArr
            .filter(itm => itm.value > 0)
              .map((itm, idx) => (
                <Button
                  key={idx}
                  onClick={handleClick}
                  color= {itm.value>1 ? 'danger' : 'primary'}
                  outline 
                  name={itm.name}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                  className={'blueTag'}>{`✓ ${itm.name}`}</Button>))
        }
      </div>
      {tagArr.filter(itm=>itm.value).length > 3 && 
        <Button 
          color='secondary'
          outline
          onClick={handleRightScroll} 
          className='filterTagScrollButton'>{'>'}</Button>}
    </React.Fragment>  
  )
}

export default AdvanceFilterTags
