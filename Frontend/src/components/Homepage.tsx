import "./Homepage.css";
import LockIcon from "@mui/icons-material/Lock";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAuthenticationStatus } from "../redux/slices/loginSlice";
import { Link } from "react-router-dom";

function Homepage() {
  const dispatch = useDispatch();
  const [isAuthenticationFailed, setIsAuthenticationFailed] = useState(
    useSelector((state: any) => state.isAuthenticationFailed)
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");

    if (errorParam) {
      dispatch(updateAuthenticationStatus(true));
      setIsAuthenticationFailed(true);
    }
  }, [dispatch]);

  return (
    <div className="flex flex-col w-full h-full bg-neutral-200 absolute overflow-hidden">
      <div className="curve bg-limegreen"></div>
      <div className="dotted-circle">
        <div className="food1"></div>
        <div className="food2"></div>
        <div className="food3"></div>
        <div className="food4"></div>
        <div className="food5"></div>
        <div className="foodtruck"></div>
      </div>
      <div className="flex top-5  w-full items-center justify-between absolute">
        <div className="flex pl-10">
          <div className="flex logo"></div>
          <div className="flex pl-2 font-semibold text-darkgreen font-poppins self-end text-lg">
            THE ROAMING KITCHEN
          </div>
        </div>
        <div className="flex pr-10">
          <Link to="/manager">
            <button className="flex items-center">
              <LockIcon></LockIcon>
              <div className="flex font-medium font-poppins pl-1 text-lg">
                Manager Login
              </div>
            </button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col absolute bottom-32 w-4/12 left-5">
        <div className="flex text-5xl pl-6 font-medium font-poppins text-darkgreen">
          Delicious
        </div>

        <div className="flex pt-5 text-4xl pl-6 font-medium font-poppins text-black">
          Quench the Hunger
        </div>

        <div className="flex pt-5  pl-6 text-sm  font-poppins  font-normal">
          Taste the difference with our freshly-made dishes that are sure to
          please your palate. Don't wait, order now and experience a feast for
          your senses!
        </div>
        <div className="flex pt-5 pl-8">
          <Link to="/customer">
            <button className="w-36 h-12 bg-darkgreen text-white font-poppins font-bold text-sm rounded-3xl">
              Quench Now
            </button>
          </Link>
        </div>
      </div>
      {isAuthenticationFailed && (
        <div className="flex text-sm absolute bottom-5 left-1/4 h-10 w-80 items-center bg-darkgreen justify-center text-white font-poppins font-bold">
          Login Failed. Please try again
        </div>
      )}
    </div>
  );
}

export default Homepage;
