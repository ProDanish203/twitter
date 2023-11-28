interface Props{
    dark: boolean;
}

export const Loader = ({dark}: Props) => {
  return (
    <>
    <div className={`${!dark ? "lds-ellipsis" : "lds-ellipsis dark"} `}><div></div><div></div><div></div><div></div></div>
    </>
  )
}
