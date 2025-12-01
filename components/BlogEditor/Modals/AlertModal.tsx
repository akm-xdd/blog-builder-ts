import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import React, { useState } from 'react'

interface AlertModalProps {
  action: () => Promise<void> | void;
  close: () => void;
}

const AlertModal = ({ action, close }: AlertModalProps) => {
    const [ loading, setLoading ] = useState(false);

    const handleAction = async() => {
        setLoading(true);
        await action();
        setLoading(false);
    }
  return (
    <AlertDialog open={true} onOpenChange={close}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove all the unsaved changes.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={close}>Cancel</AlertDialogCancel>
                <AlertDialogAction disabled={loading} onClick={handleAction}>Ok</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertModal