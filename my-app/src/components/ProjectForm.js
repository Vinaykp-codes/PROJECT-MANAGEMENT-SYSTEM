
import React, { useState, useEffect } from 'react'; // Importing useEffect
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { axiosWithToken } from '../axiosWithToken';
import { useNavigate } from 'react-router-dom';
function ProjectForm() {
  let navigate=useNavigate();
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm();
  const [showOngoing, setShowOngoing] = useState(false);
  const [inresearch,setinresearch]=useState(false);
  const [teamMembercount,setteamMemberCount]=useState(0);
  const [teammember,setteammember]=useState([]);


  const [err,setErr]=useState('');
  let {currentUser}=useSelector((state)=>state.studentTeacher);
  const [publicationDetails, setPublicationDetails] = useState({
    name: '',
    pdate: '',
    ISno: '',
    impactf: '',
    indexed: null
  });

  const selectedPartOf = watch('leadsto', []);


    useEffect(() => {
      if (selectedPartOf.includes('Funding Project')) {
        setShowOngoing(true);
      } else {
        setShowOngoing(false);
      }
      if (selectedPartOf.includes('Research')) {
        setinresearch(true);
      } else {
        setinresearch(false);
      }
    }, [selectedPartOf]);
    
    const handleTeammembercount=(e)=>{
      const count=parseInt(e.target.value,10);
      setteamMemberCount(count);
      const members=Array.from({length:count},(_,i)=>({name:'',rollNo:''}));
      setteammember(members);
    }
    const handleTeamMemberChange=(index,field,value)=>{
      const updated=[...teammember];
      updated[index][field]=value;
      setteammember(updated);
    }
    const handlePublicationDetailChange = (field, value) => {
      setPublicationDetails(prev => ({ ...prev, [field]: value }));
    }
    
    
  const leadsto = [
    { value: 'Research', label: 'Research' },
    { value: 'Patent', label: 'Patent' },
    { value: 'Consultancy', label: 'Consultancy' },
    { value: 'StartUp', label: 'StartUp' },
    { value: 'Societal Impact', label: 'Societal Impact' },
    { value: 'Funding Project', label: 'Funding Project' },
    { value: 'Design contests', label: 'Design Contests' },
  ];

  const partof = [
    { value: 'phD', label: 'phD work of Faculty' },
    { value: 'Industry Project', label: 'Industry Project' },
    { value: 'Institute Development Project', label: 'Institute Development Project' },
    { value: 'Awards', label: 'Awards' },
  ];
  
  const handleFormSubmit=async(userObj)=> {
    const transformedCategory = userObj.category?.value || null;

    const projectdata={
      ...userObj,
      category:transformedCategory,
      projectId:Date.now(),
      team:teammember,
      status:true,
      dateOfCreation:new Date(),
      dateOfModification:new Date(),
      author:{userId:currentUser.userId,userType:currentUser.userType},
      publicationDetails: inresearch ? { ...publicationDetails, indexed: publicationDetails.indexed?.value } : null,
    };
    console.log(currentUser.userType)
    if(currentUser.userType==='teacher'){
      const projectdata1={...projectdata,
        faculty:currentUser.userName,
        designation:currentUser.designation,
       
      }
      console.log(projectdata1)
      let res=await axiosWithToken.post('http://localhost:4000/teacher-api/project',projectdata1);
      console.log(res);
      if(res.data.message==="new project added"){ 
        delete projectdata1._id;
        // await axiosWithToken.put(`http://localhost:4000/project-api/add/${projectdata1.projectId}`,currentUser);
        navigate('/teacherprofile/my-projects');
      }else{
        setErr(res.data.message)
      }
    }else{
      let res=await axiosWithToken.post('http://localhost:4000/student-api/project',projectdata);
      console.log(res);
      if(res.data.message==="new project added"){
        let obj={...currentUser};
        delete obj._id;
        console.log(obj)
        const currentUserData = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({ ...currentUserData, permission: false }));
        let res1=await axiosWithToken.put('http://localhost:4000/student-api/disable',obj)
        console.log(res1);
        // let res2=await axiosWithToken.put(`http://localhost:4000/project-api/add/${projectdata.projectId}`,currentUser);
        // console.log(res2)
        navigate('/studentprofile/my-projects');
      }else{
        setErr(res.data.message)
      }
     
    }
    
    
    
  }
 

  return (
    <div className='container mt-5 ' style={{ height: '80vh', overflow: 'auto' }}>
      
        <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div>
          {currentUser.userType==='student'&&currentUser.permission===true&&(
            
            <>
            <div><label className='form-label'>Faculty Name</label>
            <input className='form-control' {...register('faculty',{required:true})}></input></div>
            <div><label className='form-label'>Designation</label>
            <input className='form-control' {...register('designation',{required:true})}></input>
            </div>
            </>
          )}
          <label htmlFor="title" className="form-label">Title</label>
          <input className="form-control" {...register('title', { required: true })} />
          {errors.title && <p className="error">This field is required</p>}
        </div>
        <div>
          <label htmlFor="domain" className="form-label">Domain</label>
          <input className="form-control" {...register('domain', { required: true })} />
          {errors.domain && <p className="error">This field is required</p>}
        </div>
        <div>
          <label htmlFor="category">Category</label>
          <Controller
            name="category"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: 'Application', label: 'Application' },
                  { value: 'Design/Product', label: 'Design/Product' },
                  { value: 'Research & Implementation', label: 'Research & Implementation' },
                  { value: 'Review', label: 'Review' },
                  { value: 'Societal Impact Projects', label: 'Societal Impact Projects' },
                ]}
              />
            )}
          />
          {errors.category && <p className="error">This field is required</p>}
        </div>
        <div>
          <label>This Project Leads to:</label>
          <div>
            {leadsto.map(category => (
              <div key={category.value} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  value={category.value}
                  {...register('leadsto')}
                />
                <label className="form-check-label">
                  {category.label}
                </label>
              </div>
            ))}
          </div>
          {errors.leadsto && <p className="error">This field is required</p>}
        </div>
        {showOngoing && (
          <div>
            <label>Is the project Funding ongoing?</label>
            <div className='form-check form-check-inline'>
              <input type='radio' className='form-check-input' value="yes" {...register('ongoing', { required: true })} />
              <label>Yes</label>
            </div>
            <div className='form-check form-check-inline'>
              <input type='radio' className='form-check-input' value="no" {...register('ongoing', { required: true })} />
              <label>No</label>
            </div>
            {errors.ongoing && <p className="error">This field is required</p>}
          </div>
        )}
        {inresearch&&(
          <div id="publicationDetails">
            <h3>Publication Details</h3>
            <div>
            <label htmlFor='name' className='form-label'>Journal/Conference Name:
            </label>
            <input className='form-control' id='name' type='text' onChange={(e)=>handlePublicationDetailChange('name',e.target.value)}></input></div>
            <div>
            <label htmlFor='pdate' className='form-label'>Publication Date:
            </label>
            <input className='form-control' type='date'  onChange={(e)=>handlePublicationDetailChange('pdate',e.target.value)}></input></div>
            <div>
            <label htmlFor='ISno' className='form-label'>ISSN/ISBN No:
            </label>
            <input className='form-control' type='text' onChange={(e)=>handlePublicationDetailChange('ISno',e.target.value)}></input></div>
            <div>
            <label htmlFor='impactf' className='form-label'>Impact Factor:
            </label>
            <input className='form-control' type='text' onChange={(e)=>handlePublicationDetailChange('impactf',e.target.value)} required></input></div>
            <div>
            <div>
              <label htmlFor="indexed" className='form-label'>Indexed In?</label>
              <Select
                id="indexed"
                options={[
                  { value: 'SCI', label: 'SCI' },
                  { value: 'Scopus', label: 'Scopus' },
                  { value: 'Web of Science', label: 'Web of Science' },
                  { value: 'Google', label: 'Google' },
                ]}
                onChange={(option) => handlePublicationDetailChange('indexed', option)}
              />
              {errors.indexed && <p className="error">This field is required</p>}
            </div>
               
              
            </div>
          </div>
          
        )

        }
        <div>
          <label>Project is a part of</label>
          <div>
            {partof.map(category => (
              <div key={category.value} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  value={category.value}
                  {...register('partof')}
                />
                <label className="form-check-label">
                  {category.label}
                </label>
              </div>
            ))}
          </div>
          {errors.partof && <p className="error">This field is required</p>}
        </div>
        <div>
          <label className='form-label'>Number of Team Members</label>
          <input className='form-control' value={teamMembercount} id='teammembercount' onChange={handleTeammembercount} min="0"></input>
        </div>
       {
        teammember.map((_,index)=>(
          <div key={index}>
            <div>
          
              <label htmlFor='{`teammembername${index}' className='form-label'>Team Member {index+1} Name</label>
              <input type='text' className='form-control' id={`teammembername${index}`} value={teammember[index].name} onChange={(e)=>handleTeamMemberChange(index,'name',e.target.value)} required ></input>
             
              <label htmlFor='{`teammemberRollNo${index}' className='form-label'>Team Member {index+1} Roll No</label>
              <input type='text' className='form-control' id={`teammemberRollNo${index}`} value={teammember[index].rollNo} onChange={(e)=>handleTeamMemberChange(index,'rollNo',e.target.value)} required ></input></div>
          
          </div>
        ))
       }
        <div>
          <label className='form-label'>About Project</label>
          <textarea className='form-control' rows="5" {...register("content",{required:true})}></textarea>
        </div>

        <button className="btn btn-success" type="submit">Add Project</button>
      </form>
      
    </div>
  );
}

export default ProjectForm;



