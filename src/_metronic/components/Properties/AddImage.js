import React, { useState, useEffect } from "react";
import "./index.css"

const Courses = (props) => {
  const myCourses = [
    {
      imgPath: '',
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
    let filter = courses.filter(e => Boolean(e.imgPath) === false);
    if (filter.length) {
      setErrors({ [courses.length - 1]: "Please select image!" })
    } else {
      setCourses((prevState) => {
        const initialCourse = {
          imgPath: ''
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
      <div className="button-text-alignment-plus">
        <button onClick={addCourse}>Add Property Image</button>
      </div>
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
    if (Boolean(data.imgPath) && typeof data.imgPath == 'string') {
      setcoursePath(data)
    } else if (Boolean(data.imgPath)) {
      data.src = await getBase64(data.imgPath)
      setcoursePath(data)
    } else {
      setcoursePath(data)
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    handleCourseChange(courseId, e.target.files[0], name);
  };

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  return (
    <>
      <div className="input-grid-new">
        <div className="input-grid-items">
          {Boolean(coursepath.imgPath) && typeof coursepath.imgPath == 'string' ?
            <div className="edit-pro-img-style">
              <img
                className=""
                alt="img"
                src={coursepath.imgPath}
              />
            </div>
            :
            <input
              type="file"
              className="form-control form-control-lg form-control-solid"
              name="imgPath"
              accept={accept ? accept : '*'}
              placeholder="Enter Question"
              // value={course.imgPath}
              onChange={handleChange}
            />}
        </div>

        <div className="input-grid-items">
          <button className="" onClick={() => removeCourse(courseId)} style={{ width: "100%" }}>
            <i className="ki ki-close icon-x"></i>
          </button>
        </div>
      </div>

    </>
  );
};


export default Courses;
