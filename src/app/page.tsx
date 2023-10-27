"use client"
import { useEffect, useState } from "react";
import "../app/globals.css"

/* 
Below is a Next.js page that displays team members of Uwana Energy and also uses a simple form to add new members.
1. Display all team members with the UserCard component stacked 4 per row on desktop screens and 2 per row on mobile screens. 
2. Complete the form for adding a new member to meet the following criteria
 a. All form fields are required 
 b. Only a female can be added as CEO
 c. Team can only have 7 male members
 d. Team can only have 20 members in total 
 e. Each new member's ID is an increment of the previous member's ID
 g. Add a function that resets all form fields when the "Reset" Button is clicked
 h. Align the "Reset" and "Submit" buttons to be displayed side by side both occupying 50% of their parent container on desktop screens and stacked ontop each other on mobile screens
*/

interface IUser {
    id: string;
    name: string
    gender: string;
    role: string;
}

const genders = [
    { id: 'MALE', label: 'Male' },
    { id: 'FEMALE', label: 'Female' }
]

const roles = [
    { id: 'CEO', label: 'Chief Executive Officer' },
    { id: 'COO', label: 'Chief Operations Officer' },
    { id: 'CTO', label: 'Chief Technical Officer' },
    { id: 'DEV', label: 'Frontend Developer' }
]

const data: object[] = [
    { id: '1', name: 'Charles', gender: 'Male', role: 'Chief Technical Officer' },
    { id: '2', name: 'Tayo', gender: 'Male', role: 'Chief Operations Officer' },
]

export default function TeamMembers(user: IUser) {

    const [teamData, setTeamData] = useState<object[]>(data);

    const changeTeamData  = (newData: object[]) => {
        setTeamData([
            ...teamData, newData
        ])
    }
    // Display data on UserCards stacked 4 per row on desktop screens and 2 per row on mobile screens
  return (
    <>
        <div className="users grid lg:grid-cols-4 sm:grid-cols-2 gap-4">
            {teamData.map((user: any) => (
                <UserCard {...user} key={user.id} className="" />
            ))}
        </div>
        <NewUserForm teamData={teamData} changeTeamData={changeTeamData} />
      </>
  )
}

function UserCard(user:IUser) {
    
    return (
        <div>
            <p>User #{user.id}</p>
            <p>Name: {user.name}</p>
            <p>Gender: {user.gender}</p>
        </div>
    );
}

function NewUserForm({...props}) {
    
    const defaultValue = {
        id: '',
        name: '',
        gender: '',
        role: '',
    }

    const [formData, setFormData] = useState<IUser>(defaultValue);
    const [formError, setFormError] = useState<string>('');
    const teamData = props.teamData;

    useEffect(() => {
        setFormData(defaultValue)
    }, [])

    const onChangeData = (e: any) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }

    const onDataReset = async () => {
        setFormData(defaultValue);
        setFormError("");
    };

    const onSubmitData = async () => {
        // validate submited data and add to data array
        setFormError("")
        const maleTeamMembers = teamData.filter(({...teamData}) => {
          return teamData.gender === "Male";
        });
        const dataCEO = teamData.filter(({...teamData}) => {
            return teamData.role === "Chief Executive Officer"
        })
        
        const noOfTeamMembers = teamData.length;
        const lastId = teamData[noOfTeamMembers - 1].id
        
        if (formData.name !== '' && formData.gender !== '' && formData.role !== '')
        {
            if (formData.role === "Chief Executive Officer")
            {
                if (formData.gender !== "Female")
                {
                setFormError("CEO can only be female");
                } else if ( dataCEO.length == 1 )
                {
                    setFormError("The role of Chief Executive Officer has been filled")
                }
            }
            else if (maleTeamMembers.length == 7)
            {
                setFormError("Only 7 male members are allowed on the team. This team member has to be female")
            }
            else if (noOfTeamMembers == 20)
            {
                setFormError("Maximum number of team members reached.")
            }
            
            else {
                const id = parseInt(lastId) + 1;
                formData.id = id.toString();
                setFormData({
                    ...formData
                });
                props.changeTeamData(formData);
                console.log(teamData)
                setFormData(defaultValue)
                setFormError("");
            }
        } else {
            if (formData.name == '')
            {
                setFormError("Name is required");
            }
            else if (formData.gender == "")
            {
                setFormError("Gender is required");
            }
            else if (formData.role == "")
            {
                setFormError("User role is required")
            }
        }

        
    }

    return (
        <>
            <div className="py-9">
                <div>{formError}</div>
                <div>
                    <input required className="input" type="text" placeholder="Name" name="name" value={formData.name} onChange={onChangeData} />
                </div>
                <div>
                    <select required placeholder="Gender" name="gender" value={formData.gender} onChange={onChangeData} >
                        {genders.map(each => (
                            <option value={each.label} key={each.id}>{each.id}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <select required name="role" value={formData.role} onChange={onChangeData} >
                      {roles.map(role => (
                        <option value={role.label} key={role.id}>{role.label}</option>
                      ))}
                    </select>
                </div>
                <div className="justify-center grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="w-full text-center">
                        <button onClick={() => onDataReset()} className="w-fit">Reset</button>
                    </div>
                    <div className="w-full text-center">
                        <button onClick={() => onSubmitData()} className="w-fit">Submit</button>
                    </div>
                </div>
            </div>

        </>
    );
}