import React, { useEffect, useState } from "react";

const initialState = {
	label: "",
	done: false
}

const urlBase = "https://playground.4geeks.com/apis/fake/todos/user/runaway"

const Home = () => {
	const [task, setTask] = useState(initialState); // state which saves the current task

	const [listTask, setListTask] = useState([]); // task to add to the list of tasks

	const [error, setError] = useState(false) // The app starts w/o errors

	const getTask = async () => {
		try {
			let response = await fetch(urlBase) //by default fetch uses GET method
			let data = await response.json() // once response is resolved, then response is transformed to json format 
			if (response.ok) {
				setListTask(data)
			}
			if (response.status == 404) {
				createUser()
			}

		} catch (error) {
			console.log(error)
		}
	}

	const createUser = async () => {
		try {
			// POST methos has two parameters:
			// 1. the url 
			// 2. the object
			let response = await fetch(urlBase, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify([])
			})

			if (response.ok) {
				getTask()
			}

		} catch (error) {
			console.log(error)
		}
	}

	const handleChange = (event) => {
		setTask({
			label: event.target.value,
			done: false
		}); //function setTask send the text entered to the input into task 
	}

	const handleSubmit = (event) => {
		event.preventDefault()
	}

	const handleSaveTask = async (event) => {
		if (event.key === "Enter") {
			if (task.label.trim() != "") {
				// setListTask([...listTask, task]); // spread operator to add the task to the listTask
				// setTask(initialState)
				// setError(false)
				try {
					let response = await fetch(urlBase, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify([...listTask, task])
					})

					if (response.ok) {
						getTask()
						setTask(initialState)
						setError(false)
					}

				} catch (error) {
					console.log(error)
				}
			} else {
				setError(true)
			}
		}
	}

	const deleteTask = async (id) => {
		let newArray = listTask.filter((_, index) => index != id)
		try {
			let response = await fetch(urlBase, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(newArray)
			})

			if (response.ok) {
				getTask()
			}

		} catch (error) {
			console.log(error)
		}
	}

	const deleteAll = async () => {
		try {
			let response = await fetch(urlBase, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				}
			})

			if (response.ok) {
				getTask()
			}

		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getTask()
	}, [])

	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-12 col-md-8">
					<h1 className="text-center">My ToDo List</h1>
					{error ? <div className="alert alert-danger">This field is required</div> : ""}
					<form onSubmit={handleSubmit}>
						<input
							type="text"
							className="form-control"
							placeholder="Add a task..."
							name="label"
							value={task.label} //to synchronize the input with the state
							onChange={handleChange}
							onKeyDown={handleSaveTask}
						/>
						<ul>
							{listTask.map((item, index) => {
								return (
									<li
										className="mt-3"
										key={index}>
										{item.label}
										<span className="float-end">
											<i className="fas fa-trash border border-secondary rounded-circle p-2 me-2" onClick={() => deleteTask(index)}></i>
										</span>
									</li>
								)
							})}
						</ul>
						<hr />
						<div>
							{listTask.length == 1 ?
								<p className="fs-3 float-start">{listTask.length} task <span><i className="far fa-smile-wink"></i></span></p> :
								<p className="fs-3 float-start">{listTask.length} tasks <span><i className="far fa-grin-beam-sweat"></i></span></p>}
							<button
								type="button"
								className="btn btn-secondary mt-2 float-end"
								onClick={() => deleteAll()}
							>Delete All</button>
						</div>
					</form>
				</div>
			</div>
		</div >
	)
};

export default Home;