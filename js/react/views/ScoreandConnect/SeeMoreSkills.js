import React,{useState} from 'react'
import {Button} from 'reactstrap'
const SeeMoreSkills = ({skillsArray}) => {
  const [seeMore, setSeeMore] = useState(false)
  
  const handleSeeMore = () => {
    setSeeMore(!seeMore)
  }

  return (
    <React.Fragment>
      {skillsArray.length>10 ? 
        skillsArray.slice(0,9).map(skl => skl) :
        skillsArray.map(skl => skl)}
      {seeMore ? skillsArray.slice(9).map(skl => skl) : ''}
      {skillsArray.length>10 && 
        <Button 
          className='seeMoreButton'
          onClick={handleSeeMore}>
          {`${seeMore ? '-': '+'} See ${skillsArray.slice(9).length} ${seeMore ? 
              'Less' : 'More'}`}
        </ Button>}
    </React.Fragment>
  )
}

export default SeeMoreSkills
