const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password , setPassword] = useState('');
  const [confirmPassword , setConfirmPassword] = useState('');
  const [error, setError] = useState({__html: ''});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: fullName, email, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Signup failed');
      }
      // Handle successful signup (e.g., redirect to login)
    } catch (err) {
      setError(err.message);
    }
  };
