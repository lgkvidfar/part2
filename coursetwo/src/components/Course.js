import React from "react"

const Header = ({name}) =>  <h1>{name}</h1>

const Part = ({courses,section}) => {
  return (
    <div>
      Part {section+1} is here...
      <Content courses={courses} section={section}/>
    </div>
  )
}

const Content = ({courses,section}) => {
  return (
    <div>
      {courses[section].parts.map(part=> <p key={part.id}> {part.name} {part.exercises}</p>)}
    </div>
  )
}

const Total = ({courses,section}) => {
  const sum = courses[section].parts.reduce((acc, cur) => acc + cur.exercises,0)
  return (
      <div>
        sum of exercises: {sum}
      </div>
  )
}

const Course = ({courses}) => {
  return (
    <div>
      <Header name={courses[0].name} />
      <Part courses={courses} section={0}/>
      <Total courses={courses} index={courses[0]} section={0} />
      <Header name={courses[1].name} />
      <Part courses={courses} section={1}/>
      <Total courses={courses}  section={1} />
    </div>
  )
}

export default Course
