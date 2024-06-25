import React, { useEffect } from 'react'
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { axiosWithToken } from '../../axiosWithToken';
function ProjectById() {
  const { state } = useLocation();
  let navigate = useNavigate();
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm();
  const [showOngoing, setShowOngoing] = useState(false);
  const [inresearch, setinresearch] = useState(false);
  const [err, setErr] = useState('');
  const [teamMembercount, setteamMemberCount] = useState(0);
  const [teammember, setteammember] = useState([]);
  let [currentProject, setCurrentProject] = useState(state);
  let { currentUser } = useSelector((state) => state.studentTeacher);
  let [projectEditStatus, setProjectEditStatus] = useState(false);
  useEffect(() => {
    if (state) {
      setCurrentProject(state);
      if (state.team) {
        setteamMemberCount(state.team.length);
        setteammember(state.team);
        setinresearch(state.publicationDetails ? true : false);
      }
    }
  }, [state]); 
  const [publicationDetails, setPublicationDetails] = useState({
    name: '',
    pdate: '',
    ISno: '',
    impactf: '',
    indexed: null
  });
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
  const disableEditStatus = () => {
    console.log(currentProject)
    setProjectEditStatus(true)
  }
  const deleteProject = async () => {
    let pro = { ...currentProject };
    delete pro._id;
    console.log(pro)
    let res = await axios.put(`http://localhost:4000/project-api/project/${currentProject.projectId}`, pro);
    if (res.data.message === 'project deleted') {
      setCurrentProject({ ...currentProject, status: res.data.payload })
    }
    console.log(currentProject);
  }
  const restoreProject = async () => {
    let pro = { ...currentProject }
    delete pro._id;
    console.log(pro)
    let res = await axios.put(`http://localhost:4000/project-api/project/${currentProject.projectId}`, pro);
    if (res.data.message === 'project restored') {
      setCurrentProject({ ...currentProject, status: res.data.payload })
    }
    console.log(currentProject)
  }
  const handleTeammembercount = (e) => {
    const count = parseInt(e.target.value, 10);
    setteamMemberCount(count);
    const members = Array.from({ length: count }, (_, i) => ({ name: '', rollNo: '' }));
    setteammember(members);
  }
  const handleTeamMemberChange = (index, field, value) => {
    const updated = [...teammember];
    updated[index][field] = value;
    setteammember(updated);
  }
  const handlePublicationDetailChange = (field, value) => {
    setPublicationDetails(prev => ({ ...prev, [field]: value }));
  }


  const modifiedProject = async (editedProject) => {
    console.log(state)
    const transformedCategory = editedProject.category?.value || null;
    let pro = { ...state, ...editedProject }
    pro.dateOfModification = new Date();
    delete pro._id;
    let project = {
      ...pro, category: transformedCategory,
      dateOfModification: new Date(),
      publicationDetails: inresearch ? { ...publicationDetails, indexed: publicationDetails.indexed?.value } : null,
    }
    console.log(project)
    if (currentUser.userType === 'student') {
      let res = await axiosWithToken.put("http://localhost:4000/student-api/project", project);
      console.log(res.data)
      if (res.data.message === 'project modified') {
        setProjectEditStatus(false)
        console.log(res)
        navigate('/studentprofile/projects');
      }
    }
    else {
      let res = await axiosWithToken.put("http://localhost:4000/teacher-api/project", project);
      if (res.data.message === 'project modified') {
        setProjectEditStatus(false)
        console.log(res)

        navigate('/teacherprofile/projects');
      }
    }

  }




  return (
    <div className='container mt-5' style={{ height: '80vh', overflow: 'auto' }}>
      {projectEditStatus === false ? (
        <><div className="container">
          <div className='d-flex '>  
            <button className='btn btn-info w-50' type='submit' onClick={disableEditStatus}>Edit</button>
            {currentProject.status === true ? (
              <button type='submit' className='btn btn-danger w-50' onClick={deleteProject}>Delete</button>) : (
              <button type='submit' className='btn btn-warning w-50' onClick={restoreProject}>Restore</button>)}

          </div>
          <h2>{currentProject.title}</h2>
          <p><strong>Faculty:</strong> {currentProject.faculty}</p>
          <p><strong>Designation:</strong> {currentProject.designation}</p>
          <p><strong>Domain:</strong> {currentProject.domain}</p>
          <p><strong>Leads to:</strong> {currentProject.leadsto.join(',')}</p>
          <p><strong>Part of:</strong> {currentProject.partof}</p>
          <p><strong>Content:</strong> {currentProject.content}</p>
          <p><strong>Category:</strong> {currentProject.category}</p>
          <p><strong>Project ID:</strong> {currentProject.projectId}</p>
          <p><strong>Status:</strong> {currentProject.status ? 'Active' : 'Inactive'}</p>
          <p><strong>Author:</strong> {currentProject.author.userId} ({currentProject.author.userType})</p>
          {currentProject.publicationDetails && (<>
            <p><strong>Publication Details:</strong> </p>
            <p><strong>Journal/Conference Name: </strong>{currentProject.publicationDetails.name}</p>
            <p><strong>Published Date: </strong>{currentProject.publicationDetails.pdate}</p>
            <p><strong>ISSN/ISBN: </strong>{currentProject.publicationDetails.ISno}</p>
            <p><strong>Impact Factor: </strong>{currentProject.publicationDetails.impactf}</p>
            <p><strong>Indexed In: </strong>{currentProject.publicationDetails.indexed}</p>
          </>
          )}
          <h3>Team Members</h3>
          <ul>
            {currentProject.team.map((member, index) => (
              <li key={index}>{member.name} ({member.rollNo})</li>
            ))}
          </ul>
        </div></>) :
        (<div className='container mt-5 ' style={{ height: '80vh', overflow: 'auto' }}>

          <form onSubmit={handleSubmit(modifiedProject)}>
            <div>
              {currentUser.userType === 'student' && currentUser.permission === true && (

                <>
                  <div><label className='form-label'>Faculty Name</label>
                    <input className='form-control' defaultValue={currentProject.faculty} {...register('faculty', { required: true })}></input></div>
                  <div><label className='form-label'>Designation</label>
                    <input className='form-control' defaultValue={currentProject.designation} {...register('designation', { required: true })}></input>
                  </div>
                </>
              )}
              <label htmlFor="title" className="form-label">Title</label>
              <input className="form-control" defaultValue={currentProject.title} {...register('title', { required: true })} />
              {errors.title && <p className="error">This field is required</p>}
            </div>
            <div>
              <label htmlFor="domain" className="form-label">Domain</label>
              <input className="form-control" defaultValue={currentProject.domain} {...register('domain', { required: true })} />
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
                      defaultChecked={currentProject.leadsto.includes(category.value)}
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
            {inresearch && (
              <div id="publicationDetails">
                <h3>Publication Details</h3>
                <div>
                  <label htmlFor='name' className='form-label'>Journal/Conference Name:
                  </label>
                  <input className='form-control' id='name' type='text' defaultValue={currentProject.publicationDetails.name} onChange={(e) => handlePublicationDetailChange('name', e.target.value)}></input></div>
                <div>
                  <label htmlFor='pdate' className='form-label'>Publication Date:
                  </label>
                  <input className='form-control' type='date' defaultValue={currentProject.publicationDetails.pdate} onChange={(e) => handlePublicationDetailChange('pdate', e.target.value)}></input></div>
                <div>
                  <label htmlFor='ISno' className='form-label'>ISSN/ISBN No:
                  </label>
                  <input className='form-control' type='text' defaultValue={currentProject.publicationDetails.ISno} onChange={(e) => handlePublicationDetailChange('ISno', e.target.value)}></input></div>
                <div>
                  <label htmlFor='impactf' className='form-label'>Impact Factor:
                  </label>
                  <input className='form-control' type='text' defaultValue={currentProject.publicationDetails.impactf} onChange={(e) => handlePublicationDetailChange('impactf', e.target.value)} required></input></div>
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
                      defaultChecked={currentProject.partof.includes(category.value)}
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
              teammember.map((member, index) => (
                <div key={index}>
                  <div>

                    <label htmlFor='{`teammembername${index}' className='form-label'>Team Member {index + 1} Name</label>
                    <input type='text' className='form-control' id={`teammembername${index}`} value={teammember[index].name} defaultValue={member.name} onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)} required ></input>

                    <label htmlFor='{`teammemberRollNo${index}' className='form-label'>Team Member {index + 1} Roll No</label>
                    <input type='text' className='form-control' id={`teammemberRollNo${index}`} value={teammember[index].rollNo} defaultValue={member.rollNo} onChange={(e) => handleTeamMemberChange(index, 'rollNo', e.target.value)} required ></input></div>

                </div>
              ))
            }
            <div>
              <label className='form-label'>About Project</label>
              <textarea className='form-control' rows="5" defaultValue={currentProject.content}  {...register("content", { required: true })}></textarea>
            </div>

            <button className="btn btn-success d-flex mx-auto w-50 justify-content-center mt-2" type="submit">Save</button>
          </form>

        </div>)
      }

    </div>
  )

}

export default ProjectById;
