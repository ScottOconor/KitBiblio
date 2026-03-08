"use client"

import { motion } from "framer-motion"
import { CourseCard } from "./course-card"
import { useInView } from "react-intersection-observer"

interface Course {
  id: string
  title: string
  instructor: string
  description: string
  price: number
  originalPrice?: number
  image: string
  duration: string
  students: number
  rating: number
  level: string
  category: string
  lessons: number
}

interface CourseGridProps {
  courses: Course[]
  title?: string
  subtitle?: string
}

export function CourseGrid({ courses, title, subtitle }: CourseGridProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="space-y-8"
    >
      {(title || subtitle) && (
        <motion.div
          variants={itemVariants}
          className="text-center space-y-4"
        >
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            variants={itemVariants}
            transition={{ delay: index * 0.1 }}
          >
            <CourseCard course={course} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
