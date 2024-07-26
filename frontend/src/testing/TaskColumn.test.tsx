import { screen } from "@testing-library/react";
import { customRender } from "../utils/testingUtils";
import { TaskColumn } from "../components/TaskColumn/TaskColumn";



describe('Task Column Component', () => {
    it('it should display the task name and it counts', () => {
        const columns = [
            {
                "name": "Todo",
                "tasks": [
                    {
                        "title": "Build settings UI",
                        "description": "",
                        "status": "Todo",
                        "subtasks": [
                            {
                                "title": "Account page",
                                "isCompleted": false
                            },
                            {
                                "title": "Billing page",
                                "isCompleted": false
                            }
                        ]
                    }
                ]
            }
        ]
        columns.map((column, index) => (
            customRender(<TaskColumn key={index} name={column.name} tasks={column.tasks} />)
        ));

        // circle is displayed
        expect(screen.getByTestId("colorCircle")).toBeInTheDocument();
        expect(screen.getByTestId("colorCircle")).toBeVisible();

        // taskName here
        expect(screen.getByTestId("taskName")).toHaveTextContent(/todo/i);

        // task count 
        expect(screen.getByTestId("taskCount")).toHaveTextContent(/(1)/i)

    })

    it('it should display the task Container Component', () => {
        const columns = [
            {
                "name": "Todo",
                "tasks": [
                    {
                        "title": "Build settings UI",
                        "description": "",
                        "status": "Todo",
                        "subtasks": [
                            {
                                "title": "Account page",
                                "isCompleted": false
                            },
                            {
                                "title": "Billing page",
                                "isCompleted": false
                            }
                        ]
                    }
                ]
            }
        ]
        columns.map((column, index) => (
            customRender(<TaskColumn key={index} tasks={column.tasks} name={column.name}/>)
        ));

        // task Title
        expect(screen.getByTestId("taskTitle")).toHaveTextContent(/Build settings UI/i)
        expect(screen.getByTestId("taskTitle")).toBeInTheDocument()
        expect(screen.getByTestId("taskTitle")).toBeVisible()

        // subtask to be visible
        expect(screen.getByTestId("subTaskCount")).toBeVisible()
    })
})