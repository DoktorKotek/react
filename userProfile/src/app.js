import React, { useState, useEffect, useRef } from 'react'
import Button from '@skbkontur/react-ui/Button'
import Input from '@skbkontur/react-ui/Input'
import Select from '@skbkontur/react-ui/Select'
import Gapped from '@skbkontur/react-ui/Gapped'
import Modal from '@skbkontur/react-ui/Modal'
import DateInput from '@skbkontur/react-ui/DateInput'
import '@skbkontur/react-icons/Calendar'

const cities = ['Екатеринбург', 'Москва', 'Сочи']
const sex = ['Мужской', 'Женский']
const maritalStatuses = ['В браке', 'Не в браке']
const inputs = {
  name: {
    type: 'text',
    labelText: 'Имя',
    placeholder: 'Введите имя пользователя',
    validate: true,
  },
  lastname: {
    type: 'text',
    labelText: 'Фамилия',
    placeholder: 'Введите фамилию пользователя',
    validate: true,
  },
  city: {
    type: 'select',
    labelText: 'Город',
    items: cities,
    placeholder: 'Выберите город',
  },
  sex: {
    type: 'select',
    labelText: 'Пол',
    items: sex,
    placeholder: 'Укажите пол',
  },
  maritalStatus: {
    type: 'select',
    labelText: 'Семейное положение',
    items: maritalStatuses,
    placeholder: 'Укажите семейное положение',
  },
  birthday: {
    type: 'date',
    labelText: 'День рождения',
  },
  birthCity: {
    type: 'select',
    labelText: 'Город рождения',
    items: cities,
    placeholder: 'Укажите город рождения',
  },
  nationality: {
    type: 'text',
    labelText: 'Гражданство',
    placeholder: 'Укажите гражданство',
  },
  email: {
    type: 'email',
    labelText: 'Email',
    placeholder: 'Введите email',
  },
  phone: {
    type: 'text',
    labelText: 'Телефон',
    placeholder: 'Введите телефон',
  },
}

const animate = (element) => {
  if (!element) {
    return
  }
  if (element.classList.contains('error')) {
    return
  }
  element.classList.add('error')
  setTimeout(() => {
    element.classList.remove('error')
  }, 2000)
}

export function App() {
  const [currentState, setCurrentState] = useState({})
  const [prevState, setPrevState] = useState({})
  const [isOpenModal, setOpenModal] = useState(false)
  const changeField = key => event => setCurrentState({
    ...currentState,
    [key]: event.target.value,
  })
  
  Object.values(inputs).forEach(input => {
    if (input.validate) {
      input.ref = useRef(null)
    }
  })
  
  const close = () => {
    setPrevState({ ...currentState })
    setOpenModal(false)
  }
  
  const show = () => {
    const invalidatedInputs = Object.entries(inputs).filter(([key, input]) => {
      if (input.validate && !currentState[key]) {
        animate(input.ref && input.ref.current)
        return true
      }
    })
    if (!invalidatedInputs.length) {
      setOpenModal(true)
    }
  }
  
  const renderModal = () => {
    return (
      <Modal onClose={close}>
        <Modal.Header>Пользователь сохранен</Modal.Header>
        <Modal.Body>
          <p>Измененные данные:</p>
          {Object.entries(inputs).map(([key, input]) => {
            const isChange = prevState[key] && prevState[key] !== currentState[key]
            return isChange && (
              <p key={key}>
                {input.labelText}: было {prevState[key] || 'ничего'}, стало {currentState[key] || 'ничего'}
              </p>
            )
          })}
          <Button onClick={close}>Закрыть</Button>
        </Modal.Body>
      </Modal>
    )
  }
  
  return <React.Fragment>
    <h1>Информация о пользователе</h1>
    <Gapped vertical gap={20}>
      {Object.entries(inputs).map(([key, input]) => {
        return <Gapped gap={20} key={key}>
          {input.type === 'text' && ([
            <label key={key + '-label'} className="label" htmlFor={key}>{input.labelText}</label>,
            <div key={key + '-wrap'} {...input.validate && { ref: input.ref } }>
              <Input
                id={key}
                placeholder={input.placeholder}
                onChange={changeField(key)}
              />
            </div>
          ])}
          {input.type === 'select' && ([
            <label key={key + '-label'} className="label" htmlFor={key}>{input.labelText}</label>,
            <div key={key + '-wrap'}>
              <Select
                id={key}
                placeholder={input.placeholder}
                items={input.items}
                onChange={changeField(key)}
              />
            </div>
          ])}
          {input.type === 'date' && ([
            <label key={key + '-label'} className="label" htmlFor={key}>{input.labelText}</label>,
            <DateInput
              id={key}
              key={`${key}-wrap`}
              onValueChange={changeField(key)}
            />
          ])}
        </Gapped>
      })}
      <Button use="primary" onClick={show}>
        Сохранить
      </Button>
    </Gapped>
    {isOpenModal && renderModal()}
  </React.Fragment>
}
