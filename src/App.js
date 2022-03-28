import React, {useEffect, useState} from "react";
import {Field, Form} from "react-final-form";
import './App.css';
import axiosLib from "axios";

const App = () => {
    let [tasks, setTasks] = useState([]);
    const axios = axiosLib.create({
        baseURL: "http://localhost:3001/tasks",
        headers: {
            'Content-Type': 'application/json'
        }
    })

    useEffect(() => {
        getTasks();
    }, []);

    const getTasks = () => {
        axios.get("/")
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                alert("Chyba při načítání tasků z DB!!!");
            })
    }

    const addTask = (values) => {
        alert(JSON.stringify(values));
        axios.post("/",
            {
                id: tasks.length+1,
                name: values.name,
                complete: false
            }).then(response => {
            alert("Task přidán");
        })
            .catch(error => {
                alert("Task se nepodařilo přidat");
            })
        getTasks();
    }

    const completeTask = (id) => {
        let newTask = null;

        axios.get("/" + id)
            .then(response => {
                newTask = response.data;
                newTask.complete=true;
                axios.put("/"+id,newTask)
                    .then(response=>{
                        alert("Task byl označen za hotový");
                        getTasks();
                    })
                    .catch(error=>{
                        alert("Task nebyl označen jako hotový");
                    })
            }).catch(error=>{
                alert("Task nebyl nalezen.");
        })
    }

    return (<div>
        <div>
            <section>
                <Form onSubmit={addTask}
                      validate={values => {
                          let errors = {};
                          if (!values.name) {
                              errors.name = "Zadejte jméno";
                          }
                          return errors;
                      }}
                      render={({handleSubmit}) => (
                          <>
                              <Field name={"name"}>
                                  {({input, meta}) => (
                                      <>
                                          <span>Název:</span>
                                          <input
                                              {...input}
                                              name={"name"}
                                              type={"text"}
                                              placeholder={"Zadejte název"}
                                          />
                                          {meta.error && meta.touched && <span>{meta.error}</span>}
                                      </>
                                  )}
                              </Field>
                              <button type={"submit"} onClick={handleSubmit} name={"btnSubmit"}>Přidat</button>

                          </>
                      )}
                />
            </section>
        </div>
        <Tasks tasks={tasks} onClick={completeTask}/>
    </div>)
}

const Task = (props) => (
    <tr>
        <td>{props.task.name}</td>
        <td>
            <button
                onClick={() => props.onClick(props.task.id)}>{props.task.complete ? "Vrátit zpět" : "Hotovo"}</button>
        </td>
    </tr>
)

const Tasks = (props) => (
    <table>
        {props.tasks.filter(item => !item.complete).map((filteretItem, index) => <Task task={filteretItem}
                                                                                       onClick={props.onClick}
                                                                                       key={index.toString()}/>)}
    </table>
)


export default App;
