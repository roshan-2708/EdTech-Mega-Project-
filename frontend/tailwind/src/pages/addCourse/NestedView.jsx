import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxDropdownMenu } from "react-icons/rx";
import { MdOutlineModeEditOutline, MdDelete } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { IoMdArrowDropdown } from "react-icons/io";

import SubSectionModal from "./SubSectionModal";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { deleteSection } from "../../services/operations/sectionApi";
import { deleteSubSection } from "../../services/operations/subSection";
import { setCourse } from "../../slice/courseSlice";

const NestedView = ({ handleChangeEditSectionName }) => {
    const dispatch = useDispatch();
    const { course } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);

    // Modal states
    const [addSubSection, setAddSubSection] = useState(null);
    const [viewSubSection, setViewSubSection] = useState(null);
    const [editSubSection, setEditSubSection] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null);

    const handleDeleteSection = async (sectionId) => {
        try {
            console.log("Deleting section:", sectionId);
            const result = await deleteSection(
                {
                    sectionId,
                    courseId: course._id,
                },
                token
            );

            if (result) {
                dispatch(setCourse(result));
                console.log("Section deleted, updated course:", result);
            }
        } catch (error) {
            console.error("Delete section error:", error);
        } finally {
            setConfirmationModal(null);
        }
    };

    const handleDeleteSubSection = async (subSectionId, sectionId) => {
        try {
            console.log("Deleting subsection:", subSectionId, "from section:", sectionId);
            const result = await deleteSubSection(
                {
                    subSectionId,
                    sectionId,
                    courseId: course._id,
                },
                token
            );

            if (result) {
                dispatch(setCourse(result));
                console.log("Subsection deleted, updated course:", result);
            }
        } catch (error) {
            console.error("Delete subsection error:", error);
        } finally {
            setConfirmationModal(null);
        }
    };

    const handleAddLecture = (sectionId) => {
        console.log("Add lecture - sectionId:", sectionId);
        setAddSubSection(sectionId);
    };

    const handleEditLecture = (subSectionData, sectionId) => {
        console.log("Edit lecture:", subSectionData._id, "section:", sectionId);
        setEditSubSection({
            ...subSectionData,
            sectionId,
        });
    };

    const handleViewLecture = (subSectionData) => {
        console.log("View lecture:", subSectionData._id);
        setViewSubSection(subSectionData);
    };

    return (
        <div className="space-y-6">
            {course?.courseContent?.map((section, index) => (
                <div key={section._id} className="border border-gray-200 rounded-lg">
                    {/* Section Header */}
                    <details className="bg-gray-800 text-white p-6 border-b border-gray-700">
                        <summary className="flex justify-between items-center cursor-pointer list-none p-0">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-12 bg-blue-400 rounded-full" />
                                <div>
                                    <h3 className="text-xl font-bold">
                                        {section.sectionName}
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                        {section.subSection?.length || 0} lectures
                                    </p>
                                </div>
                            </div>
                            <IoMdArrowDropdown className="text-xl text-gray-400 transition-transform duration-300" />
                        </summary>

                        {/* Section Actions */}
                        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700 pb-6">
                            <button
                                onClick={() =>
                                    handleChangeEditSectionName(section._id, section.sectionName)
                                }
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                                title="Edit section name"
                            >
                                <MdOutlineModeEditOutline className="text-sm" />
                                Edit
                            </button>

                            <button
                                onClick={() =>
                                    setConfirmationModal({
                                        text1: `Delete "${section.sectionName}"?`,
                                        text2: `All ${section.subSection?.length || 0} lectures will be permanently deleted.`,
                                        btn1Text: "Delete Section",
                                        btn2Text: "Cancel",
                                        btn1Handler: () => handleDeleteSection(section._id),
                                        btn2Handler: () => setConfirmationModal(null),
                                    })
                                }
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                                title="Delete entire section"
                            >
                                <MdDelete className="text-sm" />
                                Delete
                            </button>
                        </div>

                        {/* Subsections */}
                        <div className="ml-12 p-6 space-y-3 pb-6">
                            {section.subSection?.length > 0 ? (
                                section.subSection.map((lecture) => (
                                    <div
                                        key={lecture._id}
                                        className="flex justify-between items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 cursor-pointer transition-colors group"
                                        onClick={() => handleViewLecture(lecture)}
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-2 h-8 bg-green-400 rounded-full" />
                                            <div>
                                                <h4 className="font-semibold text-white truncate max-w-md">
                                                    {lecture.title}
                                                </h4>
                                                <p className="text-xs text-gray-300">
                                                    {Math.floor(lecture.timeDuration / 60)}:
                                                    {String(lecture.timeDuration % 60).padStart(2, "0")}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Lecture Actions */}
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all ml-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditLecture(lecture, section._id);
                                                }}
                                                className="p-2 hover:bg-blue-500 rounded transition-colors"
                                                title="Edit lecture"
                                            >
                                                <MdOutlineModeEditOutline className="text-blue-400 hover:text-blue-200 text-lg" />
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setConfirmationModal({
                                                        text1: `Delete "${lecture.title}"?`,
                                                        text2: "This lecture will be permanently deleted.",
                                                        btn1Text: "Delete Lecture",
                                                        btn2Text: "Cancel",
                                                        btn1Handler: () => handleDeleteSubSection(lecture._id, section._id),
                                                        btn2Handler: () => setConfirmationModal(null),
                                                    });
                                                }}
                                                className="p-2 hover:bg-red-500 rounded transition-colors"
                                                title="Delete lecture"
                                            >
                                                <MdDelete className="text-red-400 hover:text-red-200 text-lg" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600">
                                    <div className="text-4xl mb-4 opacity-50">📹</div>
                                    <p className="text-gray-400 mb-6">No lectures yet</p>
                                    <button
                                        onClick={() => handleAddLecture(section._id)}
                                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        <CiCirclePlus />
                                        Add First Lecture
                                    </button>
                                </div>
                            )}

                            {/* Add Lecture Button */}
                            <button
                                onClick={() => handleAddLecture(section._id)}
                                className="flex items-center gap-3 w-full justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold border-2 border-blue-600 transition-colors"
                            >
                                <CiCirclePlus className="text-lg" />
                                Add New Lecture
                            </button>
                        </div>
                    </details>
                </div>
            ))}

            {/* Modals */}
            {addSubSection && (
                <SubSectionModal
                    modalData={addSubSection}
                    setModalData={setAddSubSection}
                    add={true}
                />
            )}

            {viewSubSection && (
                <SubSectionModal
                    modalData={viewSubSection}
                    setModalData={setViewSubSection}
                    view={true}
                />
            )}

            {editSubSection && (
                <SubSectionModal
                    modalData={editSubSection}
                    setModalData={setEditSubSection}
                    edit={true}
                />
            )}

            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </div>
    );
};

export default NestedView;
