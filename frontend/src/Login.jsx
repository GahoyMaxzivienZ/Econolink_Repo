import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  // SLIDESHOW
  useEffect(() => {
    const slides = document.querySelectorAll(".slide");
    let index = 0;

    const interval = setInterval(() => {
      slides[index]?.classList.remove("active");
      index = (index + 1) % slides.length;
      slides[index]?.classList.add("active");
    }, 4500);

    return () => clearInterval(interval);
  }, []);

const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost/project/backend/login.php", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    username,
    password,
  }),
});

    const data = await res.json();

    if (data.status === "success") {
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } else {
      setError(data.message || "Login failed!");
    }

  } catch (err) {
    setError("Server error");
  }
};
  return (
    <div style={styles.wrapper}>

      {/* SLIDES */}
      <div className="slide active" style={styles.slide1}></div>
      <div className="slide" style={styles.slide2}></div>
      <div className="slide" style={styles.slide3}></div>

      {/* DARK OVERLAY */}
      <div style={styles.overlay}></div>

      {/* LOGIN BOX */}
      <div style={styles.container}>

        {/* LOGO */}
        <img src="/logo.png" alt="logo" style={styles.logo} />

        <h2 style={styles.title}>Welcome Back to Econolink</h2>

        <p style={styles.subtitle}>
          Log in to access your EconoLink account
        </p>

        {/* ERROR */}
        {error && (
          <div style={styles.error}>{error}</div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        {/* PASSWORD */}
          <div style={styles.passwordWrapper}>
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <img
            src={showPass ? "/view.png" : "/hide.png"}
            alt="toggle"
            onClick={() => setShowPass(!showPass)}
            style={styles.icon}
          />
        </div>

        {/* BUTTON */}
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
        </form>
      </div>
    </div>
    
  );
}

const styles = {

  wrapper: {
    position: "relative",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "Poppins, sans-serif",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    zIndex: 1,
  },

  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 2,
    background: "#fff",
    padding: "55px 60px",
    borderRadius: "20px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  },

  logo: {
    width: "150px",
    marginBottom: "15px",
  },

  title: {
  fontSize: "22px",
  fontWeight: "600",
  color: "#001f3f",
  marginBottom: "6px",
},

  subtitle: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "30px",
  },

input: {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  marginBottom: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "15px",
},

passwordWrapper: {
  position: "relative",
  width: "100%",
},

  icon: {
    position: "absolute",
    marginLeft: "-40px",
    top: "38%",
    transform: "translateY(-50%)",
    width: "24px",
    cursor: "pointer",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#001f3f",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },

  error: {
    background: "#fdecea",
    color: "#b00020",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontSize: "14px",
  },

  slide1: {
    position: "absolute",
    inset: 0,
    backgroundImage: "url('/slide1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  slide2: {
    position: "absolute",
    inset: 0,
    backgroundImage: "url('/slide2.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  slide3: {
    position: "absolute",
    inset: 0,
    backgroundImage: "url('/slide3.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
};

export default Login;