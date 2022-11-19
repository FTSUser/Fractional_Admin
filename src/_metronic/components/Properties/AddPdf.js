import React, { useState, useEffect } from "react";
import "./index.css"

const AddPdf = (props) => {
  
  const myCourses = [
    {
      videoPath: '',
    },
  ];

  const [courses, setCourses] = useState([...myCourses]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    props.getCourses(courses);
  }, [courses]);

  useEffect(() => {
    if (props?.coursesEdit) {
      setCourses(props.coursesEdit)
    }
  }, []);


  const addCourse = () => {
    let filter = courses.filter(e => Boolean(e.videoPath) === false);
    if (filter.length) {
      setErrors({ [courses.length - 1]: "Please select video!" })
    } else {
      setCourses((prevState) => {
        const initialCourse = {
          videoPath: ''
        };

        return [...prevState, initialCourse];
      });
    }
  };
  const handleCourseChange = (courseId, value, name) => {
    setCourses((prevState) => {
      const course = prevState[courseId];
      course[name] = value;

      return [...prevState];
    });
    setErrors({})
  };

  const removeCourse = (courseId) => {
    setCourses((prevState) => {
      const newCourses = prevState.filter((course, i) => i != courseId);
      return [...newCourses];
    });
  };

  return (
    <>


      {courses?.map((course, i) => {
        return (
          <>
            <RenderCourse
              course={course}
              accept={props?.accept ? props?.accept : "*"}
              key={i}
              handleCourseChange={handleCourseChange}
              removeCourse={removeCourse}
              courseId={i}
            />
            <span
              style={{
                color: "red",
                top: "5px",
                fontSize: "12px",
              }}
            >
              {errors[i]}
            </span>
          </>
        );
      })}
      {!courses.length > 0 &&
      <div className="button-text-alignment-plus">
        <button onClick={addCourse}>Add Video</button>
      </div>
      }
    </>
  );
};

const RenderCourse = ({
  course,
  courseId,
  accept,
  handleCourseChange,
  removeCourse,
}) => {
  const [coursepath, setcoursePath] = useState(course);
  useEffect(() => {
    setCourse(course)
  }, [course])
  const setCourse = async (data) => {
    setcoursePath(data)
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    handleCourseChange(courseId, e.target.files[0], name);
  };

  const onView = (url) => {
    window.open(url, "_blank")
  }
  return (
    <>
      <div className="">
        {Boolean(coursepath.videoPath) && typeof coursepath.videoPath == 'string' ?
          <div style={{ display: "flex", alignItems: "center", padding: "0 0 1rem 0" }}>
            <div className="input-grid-items">
              <div className="">
                <button className="select-location-button" onClick={() => onView(coursepath.videoPath)}>
                  Click to View
                </button>
              </div>
            </div>
            <div className="input-grid-items">
              <div className="click-close" onClick={() => removeCourse(courseId)}>
                <i className="ki ki-close icon-x"></i>
              </div>
            </div>
          </div>
          :

          <input
            type="file"
            className="form-control form-control-lg form-control-solid"
            name="videoPath"
            accept={accept ? accept : '*'}
            placeholder="Enter Question"
            // value={course.videoPath}
            onChange={handleChange}
          />
        }


      </div>

    </>
  );
};


export default AddPdf;
