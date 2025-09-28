import {useState, useRef, useEffect} from 'react'
import Vapi from '@vapi-ai/web'

type VapiState = 'idle' | 'connecting' | 'listening' | 'user-speaking' | 'processing'

export const useVapi = () => {
  const [state, setState] = useState<VapiState>('idle')
  const [politeText, setPoliteText] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  const vapiRef = useRef<Vapi | null>(null)

  useEffect(() => {
    // Initialize VAPI
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY || '')
    vapiRef.current = vapi

    // Set up event listeners
    vapi.on('call-start', () => {
      setState('listening')
      setPoliteText('')
    })

    vapi.on('call-end', () => {
      setState('idle')
      setIsAnimating(false)
    })

    vapi.on('speech-start', () => {
      setState('user-speaking')
      setIsAnimating(true)
    })

    vapi.on('speech-end', () => {
      setState('processing')
      setIsAnimating(false)
    })

    vapi.on('message', message => {
      if (message.type === 'transcript' && message.role === 'assistant') {
        setPoliteText(message.transcript)
      }
    })

    vapi.on('error', error => {
      console.error('VAPI error:', error)
      setState('idle')
    })

    return () => {
      vapi.stop()
    }
  }, [])

  const handleClick = async () => {
    if (state === 'idle') {
      try {
        setState('connecting')
        await vapiRef.current?.start('3c72dfff-f375-4408-9d5d-2061d44f6e72')
      } catch (err) {
        console.error('Error starting call:', err)
        setState('idle')
      }
    } else {
      vapiRef.current?.stop()
      setState('idle')
      setPoliteText('')
      setIsAnimating(false)
    }
  }

  return {
    state,
    politeText,
    isAnimating,
    handleClick,
  }
}
