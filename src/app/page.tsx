import { useEffect, useState } from "react";

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

const data = [
    { id: '1', name: 'Charles', gender: 'Male', role: 'Chief Technical Officer' },
    { id: '2', name: 'Tayo', gender: 'Male', role: 'Chief Operations Officer' },
]

export default function TeamMembers(user: IUser) {

    // Display data on UserCards stacked 4 per row on desktop screens and 2 per row on mobile screens
  return (
    <>
      {data.map((user: IUser) => (
        <UserCard<IUser> user={user} key={user.id} className="w-1/4 sm:w-1/2" />
      ))}
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

function NewUserForm() {
    
    const defaultValue = {
        id: '',
        name: '',
        gender: '',
        role: '',
    }

    const [formData, setFormData] = useState<IUser>(defaultValue);
    const [formError, setFormError] = useState<string>('');

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
    };

    const onSubmitData = async () => {
        // validate submited data and add to data array
        
        const maleTeamMembers = data.filter(teamMember => {
          return teamMember.gender === "Male";
        });
        const noOfTeamMembers = data.length;
        const lastId = data[noOfTeamMembers - 1].id

        if (formData.role == "Chief Executive Officer" && formData.gender !== "Female")
        {
            setFormError("CEO can only be female");
        }
        if (maleTeamMembers.length == 7)
        {
          setFormError("Only 7 male members are allowed on the team. This team member has to be female")
        }
        if (noOfTeamMembers == 20)
        {
          setFormError("Maximum number of team members reached.")
        }

        if (!formError)
        {
          setFormData({
            ...formData, ["id"]: lastId + 1
          });
          data.push(formData);
          setFormData(defaultValue)
        }
    
    }

    return (
        <>
            <div>
                <div>{formError}</div>
                <div>
                    <input required className="input" type="text" placeholder="Name" name="name" value={formData.name} onChange={onChangeData} />
                </div>
                <div>
                    <select required placeholder="Gender" name="gender" value={formData.gender} onChange={onChangeData} >
                        {genders.map(each => (
                            <option value={each.id} key={each.id}>{each.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <select required placeholder="Select User Role" name="role" value={formData.role} onChange={onChangeData} >
                      {roles.map(role => (
                        <option value={role.label} key={role.id}>{role.label}</option>
                      ))}
                    </select>
                </div>
                <div className="">
                    <button onClick={onDataReset} className="w-1/2 sm:w-full">Reset</button>
                    <button onClick={onSubmitData} className="w-1/2 sm:w-full">Submit</button>
                </div>
            </div>

        </>
    );
}