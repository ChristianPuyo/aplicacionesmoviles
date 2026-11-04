import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet
} from 'react-native';
import {useState} from 'react'; 
export default function index(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const iniciarSesion = async ()=>{
    try{
       const response = await fetch(
        "http://localhost:3000/login",
        {
          method: "POST",
          headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
       )
       const data = await response.json()
       if(response.ok){
        setToken(data.token)
        console.log("Login Correcto")
        console.log("Token:", data.token)
       }else{
        console.log("Error en el login")
        console.log(data.message)
       }
    } catch(error){
      console.log(error)
    } 
  }

  return(
    <View>
      <Text>Loggin</Text>
      <TextInput
        placeholder='Email'
        value= {email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder='Password'
        value= {password}
        onChangeText={setPassword}
      />
      <Button 
        title='Login'
        onPress={iniciarSesion}
      />
      {token !== '' &&(
        <Text>"Sesión iniciada correctamente"</Text>
      )}
      
    </View>
   
  )
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },

  title:{
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center'
  },
  input:{
    borderWidth:1,
    borderColor: '#999',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8
  }
})


