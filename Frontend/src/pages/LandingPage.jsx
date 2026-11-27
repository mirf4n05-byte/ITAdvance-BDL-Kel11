import {Link} from 'react-router-dom'

function LandingPage(){
    return(
      <div className="container py-5 text-center">
        <h1 className="display-4 fw-bold text-primary">ITAdvance</h1>
        <p className="lead mt-3">
            Belajar IT lebih terarah, dan siap kerja sebelum lulus.
        </p>
        <div className="mt-4 d-flex gap-2 justify-content-center">
            <Link to="/login" className="btn btn-primary btn-lg">Masuk</Link>
            <Link to="/register" className="btn btn-outline-primary btn-lg">Daftar</Link>
         </div>
        </div>  
    )
}

export default LandingPage