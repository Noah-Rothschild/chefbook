import Form from "../components/Form";

function Login() {
  return (
    <div>
      <Form route="/chefbook/token/" method="login" />
    </div>
  );
}

export default Login;
