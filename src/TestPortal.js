import React, { useState, useEffect } from 'react';
import questionsData from './questions.json';
import './TestPortal.css';

const TestPortal = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(Array(questionsData.length).fill(''));
    const [reviewStatus, setReviewStatus] = useState(Array(questionsData.length).fill(false));
    const [timer, setTimer] = useState(60 * 30); // 30 minutes in seconds
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (timer === 0) {
            handleSubmit();
        }
        const timerInterval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [timer]);

    const handleAnswerChange = (e) => {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestion] = e.target.value;
        setAnswers(updatedAnswers);
    };

    const handleReviewStatusChange = (questionIndex) => {
        const updatedReviewStatus = [...reviewStatus];
        updatedReviewStatus[questionIndex] = !updatedReviewStatus[questionIndex];
        setReviewStatus(updatedReviewStatus);
    };

    const handleSubmit = () => {
        setSubmitted(true);
        clearInterval(timer);
    };

    const renderScore = () => {
        if (submitted) {
            return (
                <div>
                    <h3>Score: {calculateScore()} / {questionsData.length}</h3>
                </div>
            );
        }
        return null;
    };

    const calculateScore = () => {
        let score = 0;
        answers.forEach((answer, index) => {
            if (answer === questionsData[index].correctAnswer) {
                score++;
            }
        });
        return score;
    };

    const renderQuestion = (questionIndex) => {
        const question = questionsData[questionIndex];
        return (
            <div key={questionIndex}>
                <h3>Question {questionIndex + 1}</h3>
                <div className="question-text">{question.text}</div>
                <div className='row' >
                    {question.options.map((option, index) => (
                        <div className='col-md-12' key={index}>
                            <label>
                                <input
                                    type="radio"
                                    name="answer"
                                    value={option}
                                    checked={answers[questionIndex] === option}
                                    onChange={handleAnswerChange}
                                    disabled={submitted}
                                />
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
                {submitted && (
                    <div>
                        {answers[questionIndex] === question.correctAnswer ? (
                            <span>&#10004; Correct Answer</span>
                        ) : (
                            <span>&#10008; Wrong Answer</span>
                        )}
                    </div>
                )}
                <button className='btn btn-warning' style={{ marginTop: "10px" }} onClick={() => handleReviewStatusChange(questionIndex)} disabled={submitted}>
                    {reviewStatus[questionIndex] ? 'Unmark Review' : 'Mark Review'}
                </button>
            </div>
        );
    };

    return (
        <div className='container' >
            <h3>Online Test Portal</h3>
            {renderScore()}
            <div className='row'>
                <div className='col-md-4'></div>
                <div className='col-md-4'></div>
                <div className='col-md-4'>

                    {!submitted && (
                        <h3 style={{ float: "right" }} >Timer: {Math.floor(timer / 60)}:{timer % 60}</h3>

                    )}
                </div>
            </div>
            <div className="question-numbers">
                {questionsData.map((_, index) => (
                    <button
                        key={index}
                        className={`question-number 
              ${currentQuestion === index ? 'current' : ''} 
              ${answers[index] === '' ? 'unanswered' : 'answered'} 
              ${reviewStatus[index] ? 'review' : ''}`}
                        onClick={() => setCurrentQuestion(index)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <div className="question">
                {renderQuestion(currentQuestion)}
            </div>
            <div className='row' >
                <div className='col-md-4'>
                    <button className='btn btn-primary' onClick={() => setCurrentQuestion(currentQuestion - 1)} disabled={currentQuestion === 0}>
                        Previous
                    </button>

                </div>
                <div className='col-md-4'>

                </div>
                <div className='col-md-4'>

                    <button className='btn btn-primary' onClick={() => setCurrentQuestion(currentQuestion + 1)} disabled={currentQuestion === questionsData.length - 1}>
                        Next
                    </button>
                </div>
            </div>
            <button className='btn btn-success' onClick={handleSubmit} disabled={submitted}>
                Submit Test
            </button>
        </div>
    );
};

export default TestPortal;
