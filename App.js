import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text, 
  View, 
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
 } from 'react-native';
 import { Fontisto } from '@expo/vector-icons'; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true); //work에 있는지 없는지 알려줌
  const [text, setText] = useState("");
  const [toDos,setToDos] = useState({});

  useEffect(() => {
    loadToDos();
    }, []);
  const travel = () => setWorking(false); //work를 false로 변경
  const work = () => setWorking(true); //work를 다시 true로
  const onChangeText =(payload) => setText(payload);
  const saveToDos = async (toSave) =>{
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () =>{
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s)); //parse는 string을 javascript object로 만들어줌
  };

  const addToDo = async () =>{
    if(text === ""){ //비어있다면
      return;
    }
    
    //리액트에서는 절대 스테이트를 직접 수정할수 없다.
      //따라서 setState를 사용한다.
      // Object.assign은 Object를 다른 Object와 합쳐준다.
      // {}은 새로운 Object가 되고 뒤에 많은 소스를 넣을 수있는데
      // toDos는 기존에 있던 toDos이고
      //{[Date.now()]: { text, work: working }, 는 추가될  Object인데
      // 기존의 Object인 toDos의 구조를 따라작성한 것.
      //[Date.now()]의 위치는 키가되고 [Date.now()]는 현재시간을 id로 사용하기 위해서 쓴것.

    //save to do
    /* object assign 방법 어려우면 ES6 방법 사용
    const newToDos = Object.assign(
      {},
      toDos, 
      {[Date.now()] : {text, work : working}});
      */
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, work : working, done : false },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  const DoneToDo= (key) => {
    const newToDos = {... toDos,}; //object 만들고
    newToDos[key].done = true; //object 수정
    setToDos(newToDos); //그리고 newToDos라고 해줌 업떼이트
    saveToDos(newToDos); //그 행동을 에신스토리지에 저장
    };
    
  const deleteToDo =  (key) => {
    if(Platform.OS ==="web"){
      const ok = confirm("Do you want to delete this To Do?")
      if(ok){
        const newToDos = {... toDos,}; //object 만들고
        delete newToDos[key]; //이 object에서 key 삭제
        newToDos[key].done = true; //그리고 newToDos라고 해줌 업떼이트
        saveToDos(newToDos); //그 행동을 에신스토리지에 저장
      }
    } else {
      Alert.alert(
        "Delete To Do", 
        "Are you sure?",[
        {text : "Cancel"},
        {
          text : "I'm Sure",
          style: "destructive",
          onPress : () =>{
            const newToDos = {... toDos,}; //object 만들고
            delete newToDos[key]; //이 object에서 key 삭제
            setToDos(newToDos); //그리고 newToDos라고 해줌 업떼이트
            saveToDos(newToDos); //그 행동을 에신스토리지에 저장
          },
        },
      ]);
    }
    
    return; 
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{fontSize: 38,
            fontWeight: "600",
            color: working ? "#191970": theme.nTag
            }}>Work</Text>
        </TouchableOpacity>  
        <TouchableOpacity onPress={travel}> 
          <Text style={{
            fontSize: 38,
            fontWeight: "600",
            color: !working ? "#191970": theme.nTag
          }} >Travel</Text> 
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value = {text}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"} 
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
           toDos[key].working === working ? (
             <View style={styles.toDo} key={key}>
               <Text style={styles.toDoText}>{toDos[key].text}</Text>
               <TouchableOpacity onPress={() => DoneToDo(key)}>
                <Fontisto name="check" size={18} color = "#DCDCDC" />
               </TouchableOpacity>
               <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Fontisto name="trash" size={18} color = "#DCDCDC" />
               </TouchableOpacity>
             </View>
           ) : null
         )}
      </ScrollView>
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal:20,
  },
  header : {
    justifyContent:"space-between",
    flexDirection : "row",
    marginTop:100,
  },
  input : {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical:20,
    fontSize:18,
  },
  toDo:{
    backgroundColor:theme.toDo,
    marginBottom: 10,
    paddingVertical :20,
    paddingHorizontal:40,
    borderRadius: 15,
    flexDirection: "row",
    alignItems :"center",
    justifyContent: "space-between",
  },
  toDoText :{
    color: "white",
    fontSize:16,
    fontWeight:"500",
  },
});

