import React, { useState,useEffect } from 'react'
import contactService from './services/contacts'
import Notification from './components/Notification'

const SubHeader = ({text}) => {
  return (
    <h2>
      {text}
    </h2>
  )
}

const Persons = ({person,setNotification,persons,setPersons}) => {
  const handleRemove = () => {
    const confirm = window.confirm("do you want to delete this entry?")
    if(confirm) {
    const toUpdate = persons.find(e=> e.name === person.name)
    contactService
    .remove(person.id).then(setPersons(persons))
  .then(returnedName => {
      setPersons(persons.filter(e => e.id !== person.id))
    })
    setNotification(
      `the contact has been removed from the server`
    )
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  } 
}
  return (
    <div>
    <li>
      {person.id} {person.name} {person.number} <button onClick={handleRemove}>delete</button>
    </li>
    </div>
  )
}

const Form = (props) => {
  return (
    <div>
      <form onSubmit={props.addName}>
        <p>
          name: <input value={props.newName} placeholder ="add name" onChange={props.handleNameChange}/>
       </p>
      <p>
          number: <input value={props.newNumber} placeholder ="add number" onChange={props.handleNumberChange}/>
      </p>
      <button type="submit">add</button>
      </form>
    </div>
  )
}

const Search = (props) => {
  return (
    <div>
      search: <input type="text" placeholder="filter" value={props.filter} onChange={props.handleFilterChange} />
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
    <ul>
      {props.filteredPersons.map(person => 
      <Persons setNotification={props.setNotification} persons ={props.persons} setPersons={props.setPersons} key={person.name} name={person.name} number= {person.number} person={person}/>
        )}
   </ul>
   </div>
  )
}


const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter,setNewFilter ] = useState("")
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter))
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    console.log('effect')
    contactService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }

    const rejectedName = persons.map(e => e.name.toLowerCase())
    const rejectedNumber = persons.map(e => e.number)

    if(rejectedName.includes(nameObject.name.toLowerCase())){
      // update number
        const confirm = window.confirm("overwrite existing contact?")
        if(confirm) {
        const toUpdate = persons.find(e=> e.name === nameObject.name)
        contactService
        .update(toUpdate.id, nameObject)
        .then(returnedName => {
          setPersons(persons.map(e => e.id !== toUpdate.id ? e : returnedName))
        })
        .catch(error => 
          setNotification (
            ` the contact ${nameObject.name} has already been removed`
          ))
          .then(returnedName => {
            setPersons(persons.filter(e => e.name !== nameObject.name))
          })
        setNotification(
          `the number for "${nameObject.name}" has been updated on the server`
        )
        setTimeout(() => {
          setNotification(null)
        }, 3000)
      }
      //
    } else if(rejectedNumber.includes(nameObject.number)) {
      // update name
      const toUpdate = persons.find(e=> e.number === nameObject.number)
        contactService
        .update(toUpdate.id, nameObject)
        .then(returnedName => {
          setPersons(persons.map(e => e.id !== toUpdate.id ? e : returnedName))
        })
        .catch(error => 
          setNotification (
            ` the contact belonging to ${nameObject.number} has already been removed`
          ))
          .then(returnedName => {
            setPersons(persons.filter(e => e.number !== nameObject.number))
          })
        setNotification(
          `the contact for "${nameObject.number}" has been updated on the server`
        )
        setTimeout(() => {
          setNotification(null)
        }, 3000)
        //
    } else {
      setNotification(
        `the contact "${nameObject.name}" has been added`
      )
      setTimeout(() => {
        setNotification(null)
      }, 2000)
      contactService
      .create(nameObject)
      .then(returnedName => {
        setPersons(persons.concat(returnedName))
      })
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
    console.log(filteredPersons)
  }

  return (
    <div>
      <Notification message={notification}/>
      <SubHeader text="phonebook"/>
      <Search filter = {filter} handleFilterChange={handleFilterChange}/>
      <SubHeader text="add new contact"/>
      <Form addName={addName} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <SubHeader text="numbers"/>
      <Content  setPersons={setPersons} persons={persons} setNotification={setNotification} filteredPersons={filteredPersons}/>
    </div>
  )
}

export default App
