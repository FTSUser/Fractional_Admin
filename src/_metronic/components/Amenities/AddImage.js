import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../Properties/index.css"

const Courses = (props) => {
  const myCourses = [
    {
      icon: '',
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
    let filter = courses.filter(e => Boolean(e.icon) === false);
    if (filter.length) {
      setErrors({ [courses.length - 1]: "Please select image!" })
    } else {
      setCourses((prevState) => {
        const initialCourse = {
          icon: ''
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
    if (Boolean(data.icon) && typeof data.icon == 'string') {
      setcoursePath(data)
    } else if (Boolean(data.icon)) {
      data.src = await getBase64(data.icon)
      setcoursePath(data)
    } else {
      setcoursePath(data)
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'icon') {
      let fileType = e.target.files[0].type;
      if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/svg') {
        handleCourseChange(courseId, e.target.files[0], name);
      } else {
        toast.error("Please select image file!");
      }
    }
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
      <div className="">
        <div className="input-grid-items">
          <input
            type="file"
            className="form-control form-control-lg form-control-solid"
            name="icon"
            accept={accept ? accept : '*'}
            placeholder="Enter Question"
            // value={course.icon}
            onChange={handleChange}
          />
        </div>
      </div>

    </>
  );
};


export default Courses;
