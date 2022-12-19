import React, {useState} from "react";
import { Button } from 'reactstrap'

import './style.css'

const TagButtonComponent = (props) => {

  const {
    handleChange,
    tagType,
    connectMessage,
    followUpMessage1Template,
    followUpMessage2Template,
    sampleZoom30Message,
    skillsReq, 
    cursorPos
  } = props
  const [tagTab, setTagTab] = useState("Prospect Info")

  const mustHaves = skillsReq
    .filter(skl => skl.includes("Must Have"))
    .map(skl => skl.slice(0,-11))


  const TagButton = ({cursorPos, name, skillFlag=false}) => {
    
    const tagName = skillFlag ? name : name.split(" ").join("_") 


    const handleClick = () => {
      
      
      switch (tagType) {
        case 'connect': {
          // const value = skillFlag ? `${connectMessage} ${tagName}` : `${connectMessage} {{.${tagName}}}`
          const value = connectMessage.slice(0, cursorPos)+
            `${skillFlag ? tagName : `{{.${tagName}}}`}`+
            connectMessage.slice(cursorPos)
            
          const e = {
            target: {
              value
            }
          }
          handleChange(e, tagType)
          break
        }
        case 'fu1': {
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

  return (
    <React.Fragment>
      <h2 className="variableTagHeading">Variables</h2>
      <div className="tagTabsContainer" >
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
        {/* <Button 
          outline 
          color='secondary' 
          className="tagTabs" 
          onClick={(e)=>{setTagTab("Meeting Info")}}>
          Meeting Info
        </Button> */}
      </div>
      <div className="tagButtonsContainer">

        {tagTab === "Prospect Info" &&
          <React.Fragment> 

            <TagButton cursorPos={cursorPos} name={"First Name"} />
            
            <TagButton cursorPos={cursorPos} name={"Last Name"} />
            
            <TagButton cursorPos={cursorPos} name={"Full Name"} />
            
            <TagButton cursorPos={cursorPos} name={"School Name"} />

            <TagButton cursorPos={cursorPos} name={"Current Company"} />

            <TagButton cursorPos={cursorPos} name={"Current Title"} />

          </React.Fragment>}
        
        {tagTab === "Job Info" &&
          <React.Fragment>

            <TagButton cursorPos={cursorPos} name={"Job Title"} />

          </React.Fragment>}

        {tagTab === "Must Have Skills" &&
          <React.Fragment>

            {mustHaves.map((skl, idx) =>  <TagButton key={idx} cursorPos={cursorPos} name={skl} skillFlag={true} />)}

          </React.Fragment>}

        {tagTab ===  "My Info" &&
          <React.Fragment>
              
            <TagButton cursorPos={cursorPos} name={"My First Name"} />

            <TagButton cursorPos={cursorPos} name={"My Full Name"} />

          </React.Fragment>}

        {tagTab ===  "Meeting Info" &&
          <React.Fragment>
              
            <TagButton cursorPos={cursorPos} name={"Meeting Link"} />

          </React.Fragment>}
      
      </div>
    </React.Fragment>
  )

}

export default TagButtonComponent
