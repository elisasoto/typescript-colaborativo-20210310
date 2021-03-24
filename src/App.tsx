import { useState, useEffect, ReactElement } from 'react'
import { useForm } from 'react-hook-form'

import './styles/app.scss'
import './styles/quiz.scss'
import './styles/form.scss'
import './styles/container.scss'
import './constants/mocked-trivia.js'
import { mockedTrivia } from './constants/mocked-trivia.js'
import Form from './components/form/form'
import Quiz from './components/quiz/quiz'

import {Difficulty} from './constants/constants'


const categoriesURL = 'https://opentdb.com/api_category.php'
let quizURL = 'https://opentdb.com/api.php?amount=15'


type CategoryList = {
    id: string, 
    name: string,
} 


const App:React.FunctionComponent = ():ReactElement => {
    const [categoryList, setCategoryList] = useState<CategoryList[]>([])
    const [quizOptions, setQuizOptions] = useState<any>(null)
    const [questions, setQuestions] = useState<any[]>([])

    // This effect calls the array of categories and renders it in a select
    useEffect(() => {
        fetch(categoriesURL)
            .then((res) => res.json())
            .then((data) => {
                setCategoryList(data.trivia_categories)
            })
    }, [])

    console.log(questions)

    // This effect calls the trivia questions to render in the trivia section
    // @team: hay que crear una funcion que obtenga los values de quizOptionz y revise que propiedades tiene, si existen o no para popular la URL final del fetch de las preguntas como abajo se muestra
    // si el objeto es null porque todo está en any, la URL se queda como está. Si alguna propiedad es elegida, hay que modificar la URL con un tipo como el de aabajo
    // si no hay ninguno: https://opentdb.com/api.php?amount=15
    // si hay category: https://opentdb.com/api.php?amount=10&category=10
    // si hay difficulty: https://opentdb.com/api.php?amount=10&difficulty=easy
    // si hay type: https://opentdb.com/api.php?amount=10&type=multiple
    // todas https://opentdb.com/api.php?amount=10&category=10&difficulty=easy&type=multiple
    //console.log(quizOptions, quizURL);
    useEffect(() => {
    //     fetch(quizURL)
    //         .then((res) => res.json())
    //         .then((data) => {
                 setQuestions(mockedTrivia.results)
    //         })
     }, [quizOptions])


    
    // form handlers and props
    const { register, handleSubmit, errors } = useForm()
    
    function handleSubmitForm(values: any) {
      console.log(values)
      setQuizOptions(values)
    }
    
// esta funcion randomiza las preguntas
// como tipearla para poder hacer return de la funcion y poder hacer el map de las respuestas correctamente. 
    if (questions.length > 0 ){
      const {question, correct_answer, incorrect_answers} = questions[0]
    const shuffleAnswers = [correct_answer, ...incorrect_answers].sort(()=>Math.random()-0.5)
    console.log(shuffleAnswers)
    }


    return (
        <div className='App'>
            <Form/>
            <h2>OUR OPEN TRIVIA</h2>
            <form
                className='form'
                onSubmit={handleSubmit((values) => handleSubmitForm(values))}>
                <label>Elige una categoría: </label>
                <br />
                <select name='category' ref={register({ required: false })}>
                    <option value=''>Any</option>
                    {categoryList.map((category, i) => (
                        <option
                            key={category.id}
                            value={category.id}
                            placeholder='a'>
                            {category.name}
                        </option>
                    ))}
                </select>
                <br />
                <label>Elige la dificultad de tu trivia</label>
                <br />
                <select name='difficulty' ref={register({ required: false })}>
                    <option value=''>Any</option>
                    {Object.values(Difficulty).map((item, i) => (
                        <option key={i} value={item} placeholder='a'>
                            {item}
                        </option>
                    ))}
                </select>
                <br />
                <label>Selecciona el Número de Preguntas que quieres integrar</label>
                <br />
                <input type='number' name='number' placeholder='10' min='1' max='15' ref={
                    register({required: true, 
                    min:1,
                    max:15,
                    })
                }/>

                {errors.number && errors.number.type === 'required' ? (
                    <p>This field is required</p>
                ) : null}
                <br />
                <button
                    type='submit'
                    id='submitBtn'
                    className='button button--hover button--create'>
                    Create Quiz 🚀
                </button>
            </form>
            <br />
            <br />
            
            <Quiz/>
            <div className='container-trivia'>
                <h4>TRIVIA!</h4>
                {questions.length > 0 ? (
                    <>
                        <div className='question'>
                            <label dangerouslySetInnerHTML={{__html:questions[0].question }}/>
                        </div>
                        <div className='answers'>
                            {questions[0].incorrect_answers.map(
                              (answer: any, i: any) => (
                                <div key={i} className='answer'>                                
                              <label dangerouslySetInnerHTML={{__html: answer }}/> 

                                </div>
                                )
                            )} 
                        </div>
                    </>
                ) : (
                    <h4>Loading...</h4>
                )}

            </div>
        </div>
    )
}

export default App
