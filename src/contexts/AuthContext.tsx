import { createContext, ReactNode, useState, useEffect } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string;
  }
  
  type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
  }

//Tipagem para components (react node)
type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props:AuthContextProviderProps){
    const [user, setUser] = useState<User>();

  // Recuperar a informação de um estado (usuário)
  // Assim que o componente App for exibido em tela ele vai executar o useEffect
  // Que vai lá no firebase e vai monitorar se existe um login pré feito no usuário/user
  // Sim sim, ele vai lá e busca as informações do user e as preenche dentro do estado da aplicação
  // unsubscribe = desligar o eventlistening 
  //Resumindo: verifica se teve alteração no estado de autenticação do usuário, recuperando as infos do usuário altenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google account!')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        })
      }
    })

    //É recomendando retornar uma função que descadastre todos os eventlistening que me cadastrei
    return () => {
      unsubscribe();
    }
  }, [])

  async function signInWithGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

      if (result.user) {
        const { displayName, photoURL, uid } = result.user

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google account!')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        })
      }
  }

    return(
        <AuthContext.Provider value={{user, signInWithGoogle}}>
            {props.children}
        </AuthContext.Provider>
    );
}