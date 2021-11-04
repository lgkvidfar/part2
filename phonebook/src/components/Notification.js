const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
    if(message.includes('already')) {
    return (
      <div className="error">
        {message}
      </div>
    )
    } else if (message.includes("added") || message.includes("updated")){
      return (
      <div className="success">
        {message}
      </div>
      )
    }  else if (message.includes("removed")) {
      return (
        <div className="success">
          {message}
        </div>
        )
    }
  }

  export default Notification
