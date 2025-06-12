import React from 'react'

function Workshops() {
  useEffect(() => {
    return () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, []);

  return (
    <div>Workshops</div>
  )
}

export default Workshops