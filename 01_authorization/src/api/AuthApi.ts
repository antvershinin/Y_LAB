interface IAuthReq {
  email: string;
  password: string;
}

export const authUser = async (req: IAuthReq) => {
  const response = await fetch("https://fakestoreapi.com/users")    
  const data = await response.json()
  const user = data.find((el: { email: string; password: string; })=>{return el.email === req.email && el.password === req.password})
  return user ? user : undefined
}