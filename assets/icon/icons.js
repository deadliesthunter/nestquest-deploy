import { AntDesign, Feather } from "@expo/vector-icons";

export const icons = {
    index: (props)=> <AntDesign name="home" size={22} {...props} />,
    maps: (props)=> <Feather name="compass" size={22} {...props} />,
    bookmark: (props)=> <Feather name="bookmark" size={22} {...props} />,
    profile: (props)=> <AntDesign name="user" size={22} {...props} />,
}