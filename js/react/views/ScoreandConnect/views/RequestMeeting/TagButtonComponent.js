import React, {useState} from "react";
import { Button } from 'reactstrap'

import {
  manualApiCall
} from "../../../../utils";
import './style.css'

const TagButtonComponent = (props) => {
  
  const {
    handleChange,
    tagType,
    sampleZoom30Message,
    sampleZoom15Message,
    followUpMessage1Template,
    followUpMessage2Template,
    skillsReq, 
    cursorPos
  } = props

  const [tagTab, setTagTab] = useState("Prospect Info")
 
  const mustHaves = skillsReq 
    .filter(skl => skl.includes("Must Have"))
    .map(skl => skl.slice(0,-11)) 


  const TagButton = ({name, skillFlag=false}) => {
  
    const tagName = skillFlag ? name : name.split(" ").join("_") 


    const handleClick = () => {
      manualApiCall('/api/auth/user/activity/store', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "actionName": `ADDING_${tagName.toUpperCase()}_TAG_TO_REQUEST_MEETING_MESSAGE`
        })
      })
      
      switch (tagType) {
        case '15': {
          // const value = skillFlag ? `${sampleZoom15Message} ${tagName}` : `${sampleZoom15Message} {{.${tagName}}}`

          const value = sampleZoom15Message.slice(0, cursorPos)+
            `${skillFlag ? tagName : `{{.${tagName}}}`}`+
            sampleZoom15Message.slice(cursorPos)
          
          const e = {
            target: {
              value
            }
          }
          handleChange(e, tagType)
          break
        }
        case '30': {
          // const value = skillFlag ? `${sampleZoom30Message} ${tagName}` : `${sampleZoom30Message} {{.${tagName}}}`

          const value = sampleZoom30Message.slice(0, cursorPos)+
            `${skillFlag ? tagName : `{{.${tagName}}}`}`+
            sampleZoom30Message.slice(cursorPos)

          const e = {
            target: {
              value
            }
          }
          handleChange(e, tagType)
          break
        }
        case 'fu1': {
          // const value = skillFlag ? `${sampleZoom15Message} ${tagName}` : `${sampleZoom15Message} {{.${tagName}}}`

          const value = followUpMessage1Template.slice(0, cursorPos)+
            `${skillFlag ? tagName : `{{.${tagName}}}`}`+
            followUpMessage1Template.slice(cursorPos)
          
          const e = {
            target: {
              value
            }
          }
          handleChange(e, tagType)
          break
        }
        case 'fu2': {
          // const value = skillFlag ? `${sampleZoom30Message} ${tagName}` : `${sampleZoom30Message} {{.${tagName}}}`

          const value = followUpMessage2Template.slice(0, cursorPos)+
            `${skillFlag ? tagName : `{{.${tagName}}}`}`+
            followUpMessage2Template.slice(cursorPos)

          const e = {
            target: {
              value
            }
          }
          handleChange(e, tagType)
          break
        }
        default:
          return tagType
      }
    }

    return(
      <Button outline 
        color='primary' 
        className="tags"
        onClick={handleClick}>
          {name} +
        </Button>
    )
  }


  return(
    <React.Fragment>
    <h2 className="ReqMsgTagHeading">Variables</h2>
    <div className="RegMsgTagTabsContainer" >
      <Button 
        outline 
        color='secondary' 
        className={tagTab==="Prospect Info" ? "tagTabs tagTabsSelected" : "tagTabs"} 
        onClick={(e)=>{setTagTab("Prospect Info")}}>
        Prospect Info
      </Button>
      <Button 
        outline 
        color='secondary' 
        className={tagTab==="Job Info" ? "tagTabs tagTabsSelected" : "tagTabs"} 
        onClick={(e)=>{setTagTab("Job Info")}}>
        Job Info
      </Button>
      <Button 
        outline 
        color='secondary' 
        className={tagTab==="Must Have Skills" ? "tagTabs tagTabsSelected" : "tagTabs"}  
        onClick={(e)=>{setTagTab("Must Have Skills")}}>
        Must Have Skills
      </Button>
      <Button 
        outline 
        color='secondary' 
        className={tagTab==="My Info" ? "tagTabs tagTabsSelected" : "tagTabs"}  
        onClick={(e)=>{setTagTab("My Info")}}>
        My Info
      </Button>
      <Button 
          outline 
          color='secondary' 
          className={tagTab==="Meeting Info" ? "tagTabs tagTabsSelected" : "tagTabs"} 
          onClick={(e)=>{setTagTab("Meeting Info")}}>
          Meeting Info
      </Button>
    </div>
    <div className="ReqMsgTagButtonsContainer">

      {tagTab === "Prospect Info" &&
        <React.Fragment> 

          <TagButton  name={"First Name"} />
          
          <TagButton  name={"Last Name"} />
          
          <TagButton  name={"Full Name"} />
          
          <TagButton  name={"School Name"} />

          <TagButton  name={"Current Company"} />

          <TagButton  name={"Current Title"} />

        </React.Fragment>}

      {tagTab === "Job Info" &&
        <React.Fragment>

          <TagButton  name={"Job Title"} />

        </React.Fragment>}

      {tagTab === "Must Have Skills" &&
        <React.Fragment>

          {mustHaves.map((skl, idx) =>  <TagButton key={idx}  name={skl} skillFlag={true} />)}

        </React.Fragment>}

      {tagTab ===  "My Info" &&
        <React.Fragment>
            
          <TagButton  name={"My First Name"} />

          <TagButton  name={"My Full Name"} />

        </React.Fragment>}

      {tagTab ===  "Meeting Info" &&
        <React.Fragment>
            
          <TagButton  name={"Meeting Link"} />

        </React.Fragment>}

      </div>
    </React.Fragment>
  )

}

export default TagButtonComponent
